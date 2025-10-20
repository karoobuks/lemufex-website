"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import TypingDots from "@/components/loaders/TypingDots";
import { 
  FiBookOpen, 
  FiPlus, 
  FiTrash2, 
  FiSave, 
  FiDollarSign,
  FiEdit3,
  FiCheck
} from "react-icons/fi";

export default function UpdateCoursesPage() {
  const [prices, setPrices] = useState({});
  const [updatedCourses, setUpdatedCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("/api/admin/courses/get-all");
        const data = await res.json();
        if (data.courses) {
          const formatted = {};
          data.courses.forEach((c) => {
            formatted[c.name] = {
              full: c.prices?.full || "",
              installment: c.prices?.installment || "",
            };
          });
          setPrices(formatted);
        }
      } catch (error) {
        toast.error("Failed to fetch courses");
      } finally {
        setFetchLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleChange = (course, field, value) => {
    setPrices((prev) => ({
      ...prev,
      [course]: { ...prev[course], [field]: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/courses/update-prices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ batch: prices }),
      });

      const data = await res.json();

      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success(data.message || "Courses updated successfully");
        setUpdatedCourses(data.updatedCourses || []);
      }
    } catch (error) {
      toast.error("Failed to update courses");
    } finally {
      setLoading(false);
    }
  };

  const addNewCourse = () => {
    setPrices((prev) => ({
      ...prev,
      "": { full: "", installment: "" },
    }));
  };

  const deleteCourse = async (course) => {
    if (!window.confirm(`Are you sure you want to delete "${course}"?`)) {
      return;
    }

    if (!course) {
      setPrices((prev) => {
        const updated = { ...prev };
        delete updated[course];
        return updated;
      });
      return;
    }

    try {
      const res = await fetch(
        `/api/admin/courses/${course.toLowerCase().replace(/\s+/g, "-")}`,
        { method: "DELETE" }
      );

      const data = await res.json();
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success("Course deleted successfully");
        setPrices((prev) => {
          const updated = { ...prev };
          delete updated[course];
          return updated;
        });
      }
    } catch (error) {
      toast.error("Failed to delete course");
    }
  };

  const updateCourseName = (oldName, newName) => {
    setPrices((prev) => {
      const updated = { ...prev };
      const data = updated[oldName];
      delete updated[oldName];
      updated[newName] = data;
      return updated;
    });
  };

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <TypingDots />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-[#FE9900] rounded-lg">
            <FiBookOpen className="text-white" size={24} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
        </div>
        <p className="text-gray-600">Manage course pricing and availability</p>
      </div>

      {/* Add Course Button */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <button
          type="button"
          onClick={addNewCourse}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <FiPlus size={20} />
          Add New Course
        </button>
      </div>

      {/* Courses Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {Object.keys(prices).length === 0 ? (
            <div className="text-center py-12">
              <FiBookOpen className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-500 text-lg">No courses found. Add your first course!</p>
            </div>
          ) : (
            Object.keys(prices).map((course, idx) => (
              <div key={idx} className="bg-gray-50 border border-gray-200 rounded-xl p-6 space-y-4">
                {/* Course Name */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <FiEdit3 size={16} />
                    Course Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter course name"
                    value={course}
                    onChange={(e) => updateCourseName(course, e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FE9900] focus:border-transparent transition-all duration-200 placeholder:text-gray-700 placeholder:font-semibold"
                  />
                </div>

                {/* Price Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <FiDollarSign size={16} />
                      Full Payment (₦)
                    </label>
                    <input
                      type="number"
                      placeholder="Enter full payment amount"
                      value={prices[course].full}
                      onChange={(e) => handleChange(course, "full", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-700 placeholder:font-semibold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <FiDollarSign size={16} />
                      Installment (₦)
                    </label>
                    <input
                      type="number"
                      placeholder="Enter installment amount"
                      value={prices[course].installment}
                      onChange={(e) => handleChange(course, "installment", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-700 placeholder:font-semibold"
                    />
                  </div>
                </div>

                {/* Delete Button */}
                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => deleteCourse(course)}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200"
                  >
                    <FiTrash2 size={16} />
                    Delete Course
                  </button>
                </div>
              </div>
            ))
          )}

          {/* Save Button */}
          {Object.keys(prices).length > 0 && (
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-[#FE9900] hover:bg-[#E5890A] disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <TypingDots />
                ) : (
                  <>
                    <FiSave size={20} />
                    Save All Changes
                  </>
                )}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Updated Courses Preview */}
      {updatedCourses?.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <FiCheck className="text-green-600" size={20} />
            <h2 className="text-xl font-bold text-gray-900">Recently Updated</h2>
          </div>
          <div className="space-y-3">
            {updatedCourses.map((course) => (
              <div
                key={course._id}
                className="p-4 border border-green-200 rounded-lg bg-green-50"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">{course.name}</span>
                  <div className="text-sm text-gray-600">
                    Full: ₦{course.prices?.full?.toLocaleString() || 0} | 
                    Installment: ₦{course.prices?.installment?.toLocaleString() || 0}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}