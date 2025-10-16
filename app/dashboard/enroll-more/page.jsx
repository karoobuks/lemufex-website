"use client"
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaGraduationCap, FaCheckCircle, FaArrowLeft, FaSpinner } from "react-icons/fa";
import LemLoader from "@/components/loaders/LemLoader";

const EnrollMore = () => {
    const { data: session, status } = useSession();
    const userId = session?.user?.id;
    const enrolledTracks = session?.user?.trainings.map((t) => t.track.toLowerCase()) || [];
    const [loadingCourseId, setLoadingCourseId] = useState(null);
    const [courses, setCourses] = useState([]);
    const [fetchingCourses, setFetchingCourses] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setFetchingCourses(true);
                const res = await fetch("/api/courses");
                const data = await res.json();
                setCourses(data.courses || []);
            } catch (error) {
                console.error("Error fetching courses:", error);
                toast.error("Failed to load courses");
            } finally {
                setFetchingCourses(false);
            }
        }
        fetchCourses();
    }, []);

    if (status === "loading" || fetchingCourses) return <LemLoader />;

    const handleEnrollment = (course) => {
        setLoadingCourseId(course._id);
        router.push(`/payment/confirm?slug=${encodeURIComponent(course.name)}&email=${encodeURIComponent(session.user.email)}&userId=${userId}`);
    };

    const availableCourses = courses.filter(course => 
        !enrolledTracks.includes(course.name.toLowerCase())
    );

    return (
        <main className="min-h-screen bg-gradient-to-br from-[#F4F4F4] to-gray-200 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <button 
                        onClick={() => router.back()}
                        className="inline-flex items-center gap-2 text-[#002B5B] hover:text-[#FE9900] mb-4 transition-colors"
                    >
                        <FaArrowLeft /> Back to Dashboard
                    </button>
                    <h1 className="text-3xl font-bold text-[#002B5B] mb-2">
                        <FaGraduationCap className="inline mr-3 text-[#FE9900]" />
                        Expand Your Skills
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Discover additional engineering programs to enhance your expertise and advance your career.
                    </p>
                </div>

                {/* Enrolled Courses Summary */}
                {enrolledTracks.length > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                        <h3 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                            <FaCheckCircle className="text-green-600" />
                            Currently Enrolled ({enrolledTracks.length})
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {enrolledTracks.map((track, index) => (
                                <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm capitalize">
                                    {track}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Available Courses */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-semibold text-[#002B5B] mb-6 flex items-center gap-2">
                        <FaGraduationCap className="text-[#FE9900]" />
                        Available Programs
                    </h2>
                    
                    {availableCourses.length === 0 ? (
                        <div className="text-center py-12">
                            <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                All Caught Up!
                            </h3>
                            <p className="text-gray-500">
                                You're enrolled in all available programs. New courses will appear here when available.
                            </p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {availableCourses.map((course) => (
                                <div key={course._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                    <h3 className="font-semibold text-[#002B5B] mb-2">{course.name}</h3>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                        {course.description || "Enhance your engineering skills with this comprehensive program."}
                                    </p>
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-[#FE9900] font-bold">
                                            ₦{course.price?.toLocaleString() || "Contact for pricing"}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            {course.duration || "Flexible duration"}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleEnrollment(course)}
                                        disabled={loadingCourseId === course._id}
                                        className="w-full bg-[#FE9900] text-white py-2 px-4 rounded-lg font-semibold hover:bg-[#e28500] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {loadingCourseId === course._id ? (
                                            <><FaSpinner className="animate-spin" /> Processing...</>
                                        ) : (
                                            "Enroll Now"
                                        )}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}

export default EnrollMore;