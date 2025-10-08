"use client"
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const EnrollMore = () => {

    const { data:session, status} = useSession();
    const userId = session?.user?.id;

    const enrolledTracks = session?.user?.trainings.map((t) => t.track.toLowerCase()) || [];
    const [loading, setLoading] = useState(false);
    const [courses, setCourses] = useState([]);
    const router = useRouter()

   useEffect(() => {
     
    const fetchCourses = async () =>{
        try {
            const res = await fetch("/api/courses")
            const data = await res.json()
            setCourses(data.courses || []);
        } catch (error) {
           console.error("Error fetching courses:", error) 
        }
    }
      fetchCourses()
   },[])

   const handleEnroll = async (track) =>{
        //if(!traineeId) return

        try {
            setLoading(true)
            const res = await fetch(`/api/enroll-more/${userId}`, {
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({track}),
                credentials:"include",
            })
            const data = await res.json()
            if(!res.ok){
                toast.error(data.error || "Failed to enroll")
            } else {
                toast.success(data.message || `Enrolled in ${track}`)
                enrolledTracks.push(track.toLowerCase())
            }

        } catch (error) {
           console.error("Enroll error:", error)
           toast.error("Somthing went wrong") 
        } finally {
            setLoading(false);
        }
   }



    return ( 
        <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
            <div className="w-full max-w-md p-6 bg-white rounded-xl shadow">
                <h2 className="text-xl font-semibold text-[#FE9900] text-center mb-6"> Enroll More Programs</h2>
                
                <div className="space-y-3">
                    {courses.length === 0 ? (
                        <p className="text-gray-500 text-center">
                            No programs available.
                        </p>
                    ):(
                        courses.map((course) => {
                            const isEnrolled = enrolledTracks.includes(course.name.toLowerCase());
                            return(
                                <button 
                                key={ course._id}
                                disabled={isEnrolled || loading}
                                //onClick={() => handleEnroll(course.name)}
                                onClick={() => router.push(  `/payment/confirm?slug=${encodeURIComponent(course.name)}&email=${encodeURIComponent(session.user.email)}&userId=${userId}`)}
                                className={`w-full px-4 py-2 rounded-lg font-semibold transition ${
                                    isEnrolled
                                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                    : "bg-[#FE9900] text-white hover:bg-[#f79c1d]"
                                }`}
                                >
                                    {course.name} {isEnrolled && "(Enrolled)"}
                                </button>
                            )
                        })
                    )}
                </div>
            </div>
          
        </main>
     );
}
 
export default EnrollMore;