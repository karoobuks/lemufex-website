"use client";

import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { FiCalendar } from "react-icons/fi";
import { useRouter } from "next/navigation";
import TypingDots from "@/components/loaders/TypingDots";

export default function SchedulePage() {
  const [timetable, setTimetable] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/schedule", { cache: "no-store" })
      .then((r) => r.json())
      .then((json) => setTimetable(json.data || null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <header className="bg-[#002D62] text-white px-6 py-10 shadow">
        <h1 className="text-3xl font-bold">Training Schedule</h1>
        <p className="text-[#E5E7EB]">Weekly timetable set by your admin</p>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-[#002B5B] hover:text-[#FE9900] mb-6 transition-colors"
        >
          <FaArrowLeft /> Back to Dashboard
        </button>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <TypingDots />
          </div>
        ) : !timetable ? (
          <div className="bg-white rounded-2xl shadow p-12 text-center">
            <FiCalendar className="mx-auto text-gray-300 mb-4" size={56} />
            <p className="text-gray-500 text-lg font-medium">No timetable available yet.</p>
            <p className="text-gray-400 text-sm mt-1">Check back later — your admin will set it soon.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <div className="p-5 border-b border-gray-200">
              <h2 className="text-xl font-bold text-[#002D62]">{timetable.title}</h2>
              <p className="text-xs text-gray-400 mt-1">
                Version {timetable.version} · Last updated {new Date(timetable.updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </p>
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
                          <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{slot.time || "—"}</td>
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
        )}
      </div>
    </div>
  );
}
