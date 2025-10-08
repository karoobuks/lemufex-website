"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import TypingDots from "@/components/loaders/TypingDots";
import { 
  FiCalendar, 
  FiUpload, 
  FiFile, 
  FiTrash2, 
  FiEye,
  FiClock,
  FiCheck
} from "react-icons/fi";

export default function AdminSchedulesPage() {
  const { data: session, status } = useSession();
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/admin/schedules", { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          setItems(json.data || []);
        } else {
          toast.error("Failed to load schedules");
        }
      } catch (error) {
        toast.error("Error loading schedules");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!title || !file) {
      toast.error("Please provide both title and file");
      return;
    }
    setPosting(true);

    try {
      const fd = new FormData();
      fd.append("title", title);
      fd.append("file", file);

      const res = await fetch("/api/admin/schedules", { method: "POST", body: fd });
      if (res.ok) {
        const { data } = await res.json();
        setItems((prev) => [data, ...prev]);
        setTitle("");
        setFile(null);
        toast.success("Schedule uploaded successfully!");
      } else {
        toast.error("Upload failed");
      }
    } catch (error) {
      toast.error("Error uploading schedule");
    } finally {
      setPosting(false);
    }
  };

  const del = async (id) => {
    if (!window.confirm("Delete this schedule?")) return;
    
    try {
      const res = await fetch(`/api/admin/schedules/${id}`, { method: "DELETE" });
      if (res.ok) {
        setItems((prev) => prev.filter((i) => i._id !== id));
        toast.success("Schedule deleted successfully");
      } else {
        toast.error("Failed to delete schedule");
      }
    } catch (error) {
      toast.error("Error deleting schedule");
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <TypingDots />
      </div>
    );
  }
  
  if (session?.user?.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Unauthorized Access</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-[#FE9900] rounded-lg">
            <FiCalendar className="text-white" size={24} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Schedule Management</h1>
        </div>
        <p className="text-gray-600">Upload and manage training schedules with automatic versioning</p>
      </div>

      {/* Upload Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center gap-2 mb-6">
          <FiUpload className="text-[#FE9900]" size={20} />
          <h2 className="text-xl font-bold text-gray-900">Upload New Schedule</h2>
        </div>
        
        <form onSubmit={submit} className="space-y-6">
          {/* Title Input */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <FiFile size={16} />
              Schedule Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., April 2024 Training Schedule"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FE9900] focus:border-transparent transition-all duration-200 placeholder:text-gray-600 placeholder:font-medium"
              required
            />
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <FiFile size={16} />
              Upload PDF File
            </label>
            <div 
              className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
                dragActive 
                  ? 'border-[#FE9900] bg-orange-50' 
                  : file 
                    ? 'border-green-400 bg-green-50'
                    : 'border-gray-300 hover:border-[#FE9900] hover:bg-orange-50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                required
              />
              <div className="space-y-3">
                {file ? (
                  <>
                    <FiCheck className="mx-auto text-green-500" size={48} />
                    <div>
                      <p className="text-lg font-medium text-green-700">{file.name}</p>
                      <p className="text-sm text-green-600">File selected successfully</p>
                    </div>
                  </>
                ) : (
                  <>
                    <FiUpload className="mx-auto text-gray-400" size={48} />
                    <div>
                      <p className="text-lg font-medium text-gray-700">Drop your PDF file here</p>
                      <p className="text-sm text-gray-500">or click to browse</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={posting || !title || !file}
              className="flex items-center gap-2 bg-[#FE9900] hover:bg-[#E5890A] disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {posting ? (
                <TypingDots />
              ) : (
                <>
                  <FiUpload size={20} />
                  Upload Schedule
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Schedules List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <FiClock className="text-[#FE9900]" size={20} />
          <h3 className="text-xl font-bold text-gray-900">Schedule History</h3>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <TypingDots />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <FiCalendar className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500 text-lg">No schedules uploaded yet.</p>
            <p className="text-gray-400 text-sm">Upload your first schedule to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((s) => (
              <div key={s._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FE9900] text-white">
                        v{s.versionNumber}
                      </span>
                      <h4 className="text-lg font-semibold text-gray-900">{s.title}</h4>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <FiClock size={14} />
                      <span>Uploaded {new Date(s.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <a
                      href={s.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      <FiEye size={16} />
                      View
                    </a>
                    <button
                      onClick={() => del(s._id)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200"
                    >
                      <FiTrash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
