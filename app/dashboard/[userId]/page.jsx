'use client'

import React from 'react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { FaUserCircle, FaBookOpen, FaCalendarAlt, FaChartLine, FaDownload, FaSignOutAlt, FaPlusCircle } from 'react-icons/fa';


export default  function TraineeDashboard() {

            const [loading, setLoading] = useState(true);
            const router = useRouter();
            const { data: session, status } = useSession();
            const [trainings, setTrainings] = useState([])

            const userId = session?.user?.id;
           
            useEffect(() =>{
              const fetchTrainings = async () =>{
                const res =  await fetch('/api/my-trainings')
                if(res.ok){
                  const data = await res.json();
                  setTrainings(data);
                } else{
                  throw new Error('Failed to fetch trainings');
                }
              };
              if (session) fetchTrainings()
            }, [session])

            console.log("session:", session);


                useEffect(() => {
    const checkTrainee = async () => {
      const res = await fetch('/api/check-trainee');
      const data = await res.json();
      if (!data.isTrainee) {
        router.push("/register-training");
      } else {
        setLoading(false);
      }
    };
    checkTrainee();
  }, []);
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
     
      {/* Main content */}
      <main className="max-w-7xl mx-auto p-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Welcome Card */}
        <div className="bg-white rounded-2xl shadow p-6 col-span-full">
          <h2 className="text-xl font-semibold mb-2"> {`Welcome, ${session?.user?.firstName ?? 'Guest'}`} 👋</h2>
          <p className="text-gray-600">You're currently enrolled in: 
      
     <ul className="list-disc list-inside text-sm text-gray-700">
  {trainings.map((training, idx) => (
    <li key={idx}>
      Track: <strong>{training.track}</strong>, Enrolled:{" "}
      {new Date(training.enrolledAt).toLocaleDateString()}
    </li>
  ))}
</ul>
     Keep up the great work!</p>
        </div>

        {/* Enrolled Training */}
        <DashboardCard icon={<FaBookOpen />} title="My Trainings" href={`/dashboard/${userId}/my-trainings`} desc="View modules and learning materials." />

        {/* Schedule */}
        <DashboardCard icon={<FaCalendarAlt />} title="My Schedule" href={`/dashboard/${userId}/schedule`} desc="Check your training calendar." />

        {/* Progress Tracker */}
        <DashboardCard icon={<FaChartLine />} title="Progress Tracker" href={`/dashboard/${userId}/progress`} desc="Track your learning progress." />

        {/* Resources */}
        <DashboardCard icon={<FaDownload />} title="Resources" href={`/dashboard/${userId}/resources`} desc="Download class materials and tools." />

        {/* Profile */}
        <DashboardCard icon={<FaUserCircle />} title="My Profile" href={`/dashboard/${userId}/profile`} desc="Update your personal information." />
          {/* Enroll More Programs */}
        <DashboardCard icon={<FaPlusCircle />} title="Enroll More Programs" href={`/dashboard/${userId}/enroll`} desc="Explore and sign up for new courses." />
      </main>
    </div>
  );
}

function DashboardCard({ icon, title, href, desc }) {
  return (
    <Link href={href} className="bg-white hover:bg-gray-50 transition rounded-2xl shadow p-6 flex items-start space-x-4">
      <div className="text-[#FE9900] text-2xl">{icon}</div>
      <div>
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        <p className="text-sm text-gray-600">{desc}</p>
      </div>
    </Link>
  );
}

