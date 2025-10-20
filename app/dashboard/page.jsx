"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  FaUserCircle,
  FaBookOpen,
  FaCalendarAlt,
  FaChartLine,
  FaDownload,
  FaPlusCircle,
  FaGraduationCap
} from "react-icons/fa";
import { slugify } from "@/utils/slugify";
import toast from "react-hot-toast";
import LemLoader from "@/components/loaders/LemLoader";

function DashboardCard({ icon, title, href, desc }) {
  return (
    <Link
      href={href}
      className="group bg-white hover:shadow-lg transition-all duration-200 rounded-xl shadow p-6 border border-gray-100 hover:border-[#FE9900]/30"
    >
      <div className="flex items-start space-x-4">
        <div className="text-[#FE9900] text-2xl">{icon}</div>
        <div>
          <h3 className="text-lg font-semibold mb-2 text-[#002B5B]">{title}</h3>
          <p className="text-sm text-gray-600">{desc}</p>
        </div>
      </div>
    </Link>
  );
}

function ResourcesCard({ user }) {
  const title = "Resources";
  const desc = "Download class materials and tools.";
  const icon = <FaDownload />;

  if (user?.role === "admin") {
    return (
      <DashboardCard
        icon={icon}
        title={title}
        href="/dashboard/resources"
        desc={desc}
      />
    );
  }

  if (user?.isTrainee) {
    const tracks = user.tracks || [];

    if (tracks.length === 0) {
      return (
        <DashboardCard
          icon={icon}
          title={title}
          href="/register-training"
          desc="Enroll in a training program to unlock resources."
        />
      );
    }

    if (tracks.length === 1) {
      return (
        <DashboardCard
          icon={icon}
          title={title}
          href={`/dashboard/resources/${slugify(tracks[0])}`}
          desc={desc}
        />
      );
    }

    return (
      <div className="bg-white hover:shadow-lg transition-all duration-200 rounded-xl shadow p-6 border border-gray-100 hover:border-[#FE9900]/30">
        <div className="flex items-center space-x-3 mb-4">
          <div className="text-[#FE9900] text-2xl">{icon}</div>
          <h3 className="text-lg font-semibold text-[#002B5B]">{title}</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">{desc}</p>
        <div className="space-y-2">
          {tracks.map((track) => (
            <Link
              key={track}
              href={`/dashboard/resources/${slugify(track)}`}
              className="block text-sm text-[#002B5B] hover:text-[#FE9900] py-1 transition-colors"
            >
              {track} Resources
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <DashboardCard
      icon={icon}
      title={title}
      href="/register-training"
      desc="Enroll in a training program to unlock resources."
    />
  );
}

export default function TraineeDashboard() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { data: session, status } = useSession();
  const trainings = session?.user?.trainings || [];
  const userId = session?.user?.id;
  const [isStillTrainee, setIsStillTrainee] = useState(false);
  const [enrollmentDates, setEnrollmentDates] = useState({});

  const fetchEnrollmentDates = async () => {
    try {
      const response = await fetch(`/api/trainee/${userId}`);
      if (response.ok) {
        const data = await response.json();
        const dates = {};
        data.data?.trainings?.forEach(training => {
          if (training.enrolledAt) {
            dates[training.track] = training.enrolledAt;
          }
        });
        setEnrollmentDates(dates);
      }
    } catch (error) {
      console.error('Error fetching enrollment dates:', error);
    }
  };

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }

    const isAdmin = session.user.role === "admin";
    const isTrainee = session.user.isTrainee;

    if (isAdmin) {
      setLoading(false);
      return;
    }

    if (isTrainee) {
      setIsStillTrainee(true);
      setLoading(false);
      // Fetch enrollment dates
      fetchEnrollmentDates();
      return;
    }

    router.push("/register-training");
  }, [status, session, router]);

  if (loading) return <LemLoader />;

  const userForResources = {
    _id: userId,
    role: session?.user?.role,
    isTrainee: isStillTrainee,
    tracks: trainings.map((t) => t.track),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#002B5B] mb-2">
            Welcome back, {session?.user?.firstName || "Guest"}
          </h1>
          <p className="text-gray-600">
            Your <span className="text-[#FE9900] font-semibold">Lemufex Engineering</span> learning dashboard
          </p>
        </div>

        {/* Enrolled Programs */}
        {trainings.length > 0 && (
          <div className="bg-white rounded-xl shadow p-6 mb-8">
            <h2 className="text-lg font-semibold text-[#002B5B] mb-4 flex items-center gap-2">
              <FaGraduationCap className="text-[#FE9900]" />
              Your Programs ({trainings.length})
            </h2>
            <div className="space-y-3">
              {trainings.map((training, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-[#002B5B]">{training.track}</h3>
                    <p className="text-sm text-gray-500">
                      Enrolled: {enrollmentDates[training.track] 
                        ? new Date(enrollmentDates[training.track]).toLocaleDateString()
                        : new Date().toLocaleDateString()
                      }
                    </p>
                  </div>
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                    Active
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dashboard Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard
            icon={<FaBookOpen />}
            title="My Trainings"
            href="/dashboard/my-trainings"
            desc="Access your course materials and modules"
          />

          <DashboardCard
            icon={<FaCalendarAlt />}
            title="My Schedule"
            href="/dashboard/schedule"
            desc="View upcoming classes and deadlines"
          />

          <DashboardCard
            icon={<FaChartLine />}
            title="Progress Tracker"
            href={`/dashboard/${userId}/progress`}
            desc="Monitor your learning progress"
          />

          <ResourcesCard user={userForResources} />

          <DashboardCard
            icon={<FaUserCircle />}
            title="My Profile"
            href="/dashboard/profile"
            desc="Update your personal information"
          />

          <DashboardCard
            icon={<FaPlusCircle />}
            title="Enroll More Programs"
            href="/dashboard/enroll-more"
            desc="Explore additional engineering courses"
          />
        </div>
      </div>
    </div>
  );
}