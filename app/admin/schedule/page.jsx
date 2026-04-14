"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import TypingDots from "@/components/loaders/TypingDots";
import { FiCalendar, FiPlus, FiTrash2, FiEdit2, FiSave, FiRefreshCw, FiCheck, FiX } from "react-icons/fi";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const EMPTY_SLOT = { time: "", topic: "", course: "", instructor: "", notes: "" };

export default function AdminSchedulePage() {
  const { data: session, status } = useSession();
  const [timetable, setTimetable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Draft state for the builder
  const [draftTitle, setDraftTitle] = useState("");
  const [draftDays, setDraftDays] = useState(
    DAYS.map((d) => ({ day: d, slots: [] }))
  );

  // Which slot is being edited: { dayIdx, slotIdx } | null
  const [editing, setEditing] = useState(null);
  const [editValues, setEditValues] = useState({ ...EMPTY_SLOT });

  // Mode: "view" | "new" | "edit"
  const [mode, setMode] = useState("view");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/schedules", { cache: "no-store" });
      const json = await res.json();
      if (json.data) {
        setTimetable(json.data);
        setDraftTitle(json.data.title);
        setDraftDays(
          DAYS.map((d) => {
            const found = json.data.days.find((x) => x.day === d);
            return { day: d, slots: found?.slots || [] };
          })
        );
      }
    } catch (_e) {
      toast.error("Failed to load timetable");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── Slot helpers ──────────────────────────────────────────────
  const addSlot = (dayIdx) => {
    const updated = draftDays.map((d, i) =>
      i === dayIdx ? { ...d, slots: [...d.slots, { ...EMPTY_SLOT }] } : d
    );
    setDraftDays(updated);
    const slotIdx = updated[dayIdx].slots.length - 1;
    setEditing({ dayIdx, slotIdx });
    setEditValues({ ...EMPTY_SLOT });
  };

  const removeSlot = (dayIdx, slotIdx) => {
    setDraftDays((prev) =>
      prev.map((d, i) =>
        i === dayIdx ? { ...d, slots: d.slots.filter((_, si) => si !== slotIdx) } : d
      )
    );
    if (editing?.dayIdx === dayIdx && editing?.slotIdx === slotIdx) setEditing(null);
  };

  const startEdit = (dayIdx, slotIdx) => {
    setEditing({ dayIdx, slotIdx });
    setEditValues({ ...draftDays[dayIdx].slots[slotIdx] });
  };

  const saveSlot = () => {
    const { dayIdx, slotIdx } = editing;
    setDraftDays((prev) =>
      prev.map((d, i) =>
        i === dayIdx
          ? { ...d, slots: d.slots.map((s, si) => (si === slotIdx ? { ...editValues } : s)) }
          : d
      )
    );
    setEditing(null);
  };

  // ── API actions ───────────────────────────────────────────────
  const handleSet = async () => {
    if (!draftTitle.trim()) return toast.error("Please enter a timetable title");
    setSaving(true);
    try {
      const res = await fetch("/api/admin/schedules", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: draftTitle, days: draftDays }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      setTimetable(json.data);
      setMode("view");
      toast.success(timetable ? "Timetable reset successfully!" : "Timetable created!");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEdits = async () => {
    if (!draftTitle.trim()) return toast.error("Please enter a timetable title");
    setSaving(true);
    try {
      // Save title first
      await fetch("/api/admin/schedules", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: draftTitle }),
      });
      // Save each day
      for (const d of draftDays) {
        await fetch("/api/admin/schedules", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ day: d.day, slots: d.slots }),
        });
      }
      await load();
      setMode("view");
      toast.success("Timetable updated!");
    } catch (_e) {
      toast.error("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  // ── Guards ────────────────────────────────────────────────────
  if (status === "loading") return <div className="flex items-center justify-center min-h-[400px]"><TypingDots /></div>;
  if (session?.user?.role !== "admin") return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="text-red-500 text-6xl mb-4">🚫</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Unauthorized Access</h2>
      </div>
    </div>
  );

  // ── Render ────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#FE9900] rounded-lg">
              <FiCalendar className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Timetable Management</h1>
              <p className="text-sm text-gray-500">Set, reset, or edit the weekly training timetable</p>
            </div>
          </div>

          {mode === "view" && (
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => { setMode("new"); setDraftTitle(""); setDraftDays(DAYS.map((d) => ({ day: d, slots: [] }))); }}
                className="flex items-center gap-2 bg-[#FE9900] hover:bg-[#E5890A] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                <FiRefreshCw size={14} /> {timetable ? "Reset Timetable" : "Create Timetable"}
              </button>
              {timetable && (
                <button
                  onClick={() => setMode("edit")}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                  <FiEdit2 size={14} /> Edit Timetable
                </button>
              )}
            </div>
          )}

          {(mode === "new" || mode === "edit") && (
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={mode === "new" ? handleSet : handleSaveEdits}
                disabled={saving}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                {saving ? <TypingDots /> : <><FiSave size={14} /> {mode === "new" ? "Set Timetable" : "Save Changes"}</>}
              </button>
              <button
                onClick={() => { setMode("view"); load(); }}
                className="flex items-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                <FiX size={14} /> Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Title input (edit/new mode) */}
      {(mode === "new" || mode === "edit") && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Timetable Title</label>
          <input
            type="text"
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            placeholder="e.g. May 2025 Training Schedule"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FE9900] focus:border-transparent text-sm"
          />
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <TypingDots />
        </div>
      )}

      {/* View mode — read-only timetable */}
      {!loading && mode === "view" && (
        !timetable ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <FiCalendar className="mx-auto text-gray-300 mb-4" size={56} />
            <p className="text-gray-500 text-lg font-medium">No timetable set yet.</p>
            <p className="text-gray-400 text-sm mt-1">Click "Create Timetable" to get started.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{timetable.title}</h2>
                <p className="text-xs text-gray-400">Version {timetable.version} · Last updated {new Date(timetable.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600 w-28">Day</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Time</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Topic</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Course</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Instructor</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {timetable.days.map((d) =>
                    d.slots.length === 0 ? (
                      <tr key={d.day} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-semibold text-[#002D62]">{d.day}</td>
                        <td colSpan={5} className="px-4 py-3 text-gray-400 italic">No sessions</td>
                      </tr>
                    ) : (
                      d.slots.map((slot, si) => (
                        <tr key={`${d.day}-${si}`} className="hover:bg-gray-50">
                          {si === 0 && (
                            <td className="px-4 py-3 font-semibold text-[#002D62] align-top" rowSpan={d.slots.length}>
                              {d.day}
                            </td>
                          )}
                          <td className="px-4 py-3 text-gray-700">{slot.time || "—"}</td>
                          <td className="px-4 py-3 text-gray-900 font-medium">{slot.topic || "—"}</td>
                          <td className="px-4 py-3 text-gray-700">{slot.course || "—"}</td>
                          <td className="px-4 py-3 text-gray-700">{slot.instructor || "—"}</td>
                          <td className="px-4 py-3 text-gray-500 text-xs">{slot.notes || "—"}</td>
                        </tr>
                      ))
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}

      {/* Edit / New mode — builder */}
      {!loading && (mode === "new" || mode === "edit") && (
        <div className="space-y-4">
          {draftDays.map((d, dayIdx) => (
            <div key={d.day} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-[#002D62]">
                <h3 className="text-white font-semibold">{d.day}</h3>
                <button
                  onClick={() => addSlot(dayIdx)}
                  className="flex items-center gap-1 text-xs bg-[#FE9900] hover:bg-[#E5890A] text-white px-3 py-1.5 rounded-lg transition-colors"
                >
                  <FiPlus size={12} /> Add Session
                </button>
              </div>

              {d.slots.length === 0 ? (
                <p className="px-4 py-4 text-sm text-gray-400 italic">No sessions — click "Add Session" to add one.</p>
              ) : (
                <div className="divide-y divide-gray-100">
                  {d.slots.map((slot, slotIdx) => {
                    const isEditing = editing?.dayIdx === dayIdx && editing?.slotIdx === slotIdx;
                    return (
                      <div key={slotIdx} className="p-4">
                        {isEditing ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {["time", "topic", "course", "instructor", "notes"].map((field) => (
                              <div key={field}>
                                <label className="block text-xs font-medium text-gray-500 mb-1 capitalize">{field}</label>
                                <input
                                  type="text"
                                  value={editValues[field]}
                                  onChange={(e) => setEditValues((v) => ({ ...v, [field]: e.target.value }))}
                                  placeholder={field === "time" ? "e.g. 9:00 AM - 11:00 AM" : ""}
                                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FE9900] focus:border-transparent"
                                />
                              </div>
                            ))}
                            <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-3">
                              <button onClick={saveSlot} className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors">
                                <FiCheck size={12} /> Save
                              </button>
                              <button onClick={() => setEditing(null)} className="flex items-center gap-1 border border-gray-300 hover:bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors">
                                <FiX size={12} /> Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start justify-between gap-4">
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-1 flex-1 text-sm">
                              <div><span className="text-xs text-gray-400">Time</span><p className="text-gray-800">{slot.time || "—"}</p></div>
                              <div><span className="text-xs text-gray-400">Topic</span><p className="text-gray-900 font-medium">{slot.topic || "—"}</p></div>
                              <div><span className="text-xs text-gray-400">Course</span><p className="text-gray-800">{slot.course || "—"}</p></div>
                              <div><span className="text-xs text-gray-400">Instructor</span><p className="text-gray-800">{slot.instructor || "—"}</p></div>
                              <div><span className="text-xs text-gray-400">Notes</span><p className="text-gray-500 text-xs">{slot.notes || "—"}</p></div>
                            </div>
                            <div className="flex gap-2 flex-shrink-0">
                              <button onClick={() => startEdit(dayIdx, slotIdx)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                <FiEdit2 size={14} />
                              </button>
                              <button onClick={() => removeSlot(dayIdx, slotIdx)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                <FiTrash2 size={14} />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
