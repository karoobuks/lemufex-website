'use client'

import React from 'react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaUserCircle, FaBookOpen, FaCalendarAlt, FaChartLine, FaDownload, FaSignOutAlt } from 'react-icons/fa';

export default function TraineeDashboard() {

            const [loading, setLoading] = useState(true);
            const router = useRouter();

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
      {/* Header */}
      {/* <header className="bg-[#FE9900] text-white shadow-md p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Trainee Dashboard</h1>
          <Link href="/logout" className="flex items-center space-x-2 hover:underline">
            <FaSignOutAlt /> <span>Logout</span>
          </Link>
        </div>
      </header> */}

      {/* Main content */}
      <main className="max-w-7xl mx-auto p-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Welcome Card */}
        <div className="bg-white rounded-2xl shadow p-6 col-span-full">
          <h2 className="text-xl font-semibold mb-2">Welcome, Emmanuel 👋</h2>
          <p className="text-gray-600">You're currently enrolled in <strong>Software Programming</strong>. Keep up the great work!</p>
        </div>

        {/* Enrolled Training */}
        <DashboardCard icon={<FaBookOpen />} title="My Trainings" href="/dashboard/trainings" desc="View modules and learning materials." />

        {/* Schedule */}
        <DashboardCard icon={<FaCalendarAlt />} title="My Schedule" href="/dashboard/schedule" desc="Check your training calendar." />

        {/* Progress Tracker */}
        <DashboardCard icon={<FaChartLine />} title="Progress Tracker" href="/dashboard/progress" desc="Track your learning progress." />

        {/* Resources */}
        <DashboardCard icon={<FaDownload />} title="Resources" href="/dashboard/resources" desc="Download class materials and tools." />

        {/* Profile */}
        <DashboardCard icon={<FaUserCircle />} title="My Profile" href="/dashboard/profile" desc="Update your personal information." />
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
