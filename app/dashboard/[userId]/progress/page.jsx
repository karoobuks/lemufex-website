"use client"

import { useState, useEffect, useMemo } from "react"
import { useSession } from "next-auth/react";



export default function ProgressPage(){
    const [trainings, setTrainings] = useState([]);
    const {data:session, status} = useSession()
    const userId = session?.user?.id

    useEffect(() =>{
        if(!userId) return;
        const fetchTrainee = async () =>{
            try {
                 const response = await fetch(`/api/trainee/${userId}`)
            const data = await response.json()
            setTrainings(data.trainings || [])
            } catch (err) {
                console.error('Failed to fetch trainee trainings:', err);
            }
           
        }
        fetchTrainee()
    },[status, session, userId ])

    const overallProgress = useMemo(()=> {
        if(!trainings.length) return 0;
        const totalCompleted = trainings.reduce(
            (sum, t) => sum + (t.completeModules || 0),
            0
        );
        const totalModules = trainings.reduce(
            (sum, t)=> sum + (t.totalModules || 0),
            0
        );

        return totalModules > 0
        ? Math.round((totalCompleted / totalModules) * 100)
        : 0
    },[trainings])

    return(
        <div className="min-h-screen bg-[#F9FAFB] p-6">
            <h1 className="text-3xl font-bold text-[#FE9900] mb-6">Progress Tracker</h1>

            <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200 mb-8">
                <h2 className="text-lg font-semibold text-gray-700 mb-2">
                    Overall Progress
                </h2>
                <div className=" w-full bg-gray-200 rounded-full h-4 mb-2">
                    <div 
                    className="bg-[#FE9900] h-4 rounded-full transition-all duration-500"
                    style={{width:`${overallProgress}%`}}>
                        
                    </div>
                    <p className="text-sm text-gray-500">{overallProgress}% completed</p>

                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {trainings.map((p, idx) =>{
                        const percentage = p.totalModules > 0 ?
                        Math.round((p.completeModules / p.totalModules) * 100)
                        : 0;

                        return(
                            <div
                            key={idx}
                            className=" bg-white rounded-xl shadow-md p-4 border border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-700 mb-2">
                                    {p.courseName}
                                </h2>
                                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                                    <div
                                    className="bg-[#FE9900] h-3 rounded-full transition-all duration-500"
                                    style={{width:`${percentage}%`}}>

                                    </div>
                                    <p className="text-sm text-gray-500">
                                     {p.completeModules} / {p.totalModules} modules completed({percentage}%)    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

        </div>
    )
}
