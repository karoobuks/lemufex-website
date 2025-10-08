//  'use client'

//  import React from 'react';
//  import Link from 'next/link';
//  import { useState, useEffect } from 'react';
//  import { useRouter } from 'next/navigation';
//  import { useSession } from 'next-auth/react';

//  import { FaUserCircle, FaBookOpen, FaCalendarAlt, FaChartLine, FaDownload, FaSignOutAlt, FaPlusCircle } from 'react-icons/fa';


//  export default  function TraineeDashboard() {

//              const [loading, setLoading] = useState(true);
//              const router = useRouter();
//              const { data: session, status } = useSession();
//              const [trainings, setTrainings] = useState([])

//              const userId = session?.user?.id;
           
//              useEffect(() =>{
//                const fetchTrainings = async () =>{
//                  const res =  await fetch('/api/my-trainings')
//                  if(res.ok){
//                    const data = await res.json();
//                    setTrainings(data);
//                  } else{
//                    throw new Error('Failed to fetch trainings');
//                  }
//                };
//                if (session) fetchTrainings()
//              }, [session])

//              console.log("session:", session);


//                  useEffect(() => {
//      const checkTrainee = async () => {
//        const res = await fetch('/api/check-trainee');
//        const data = await res.json();
//        if (!data.isTrainee) {
//          router.push("/register-training");
//        } else {
//          setLoading(false);
//        }
//      };
//      checkTrainee();
//    }, []);
//    return (
//      <div className="min-h-screen bg-gray-100 text-gray-800">
     
//        {/* Main content */}
//        <main className="max-w-7xl mx-auto p-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//          {/* Welcome Card */}
//          <div className="bg-white rounded-2xl shadow p-6 col-span-full">
//            <h2 className="text-xl font-semibold mb-2"> {`Welcome, ${session?.user?.firstName ?? 'Guest'}`} 👋</h2>
//            <p className="text-gray-600">You're currently enrolled in: 
      
//       <ul className="list-disc list-inside text-sm text-gray-700">
//    {trainings.map((training, idx) => (
//      <li key={idx}>
//        Track: <strong>{training.track}</strong>, Enrolled:{" "}
//        {new Date(training.enrolledAt).toLocaleDateString()}
//      </li>
//    ))}
//  </ul>
//       Keep up the great work!</p>
//          </div>

//          {/* Enrolled Training */}
//          <DashboardCard icon={<FaBookOpen />} title="My Trainings" href={`/dashboard/${userId}/my-trainings`} desc="View modules and learning materials." />

//          {/* Schedule */}
//          <DashboardCard icon={<FaCalendarAlt />} title="My Schedule" href={`/dashboard/${userId}/schedule`} desc="Check your training calendar." />

//          {/* Progress Tracker */}
//          <DashboardCard icon={<FaChartLine />} title="Progress Tracker" href={`/dashboard/${userId}/progress`} desc="Track your learning progress." />

//          {/* Resources */}
//          <DashboardCard icon={<FaDownload />} title="Resources" href={`/dashboard/${userId}/resources`} desc="Download class materials and tools." />

//          {/* Profile */}
//          <DashboardCard icon={<FaUserCircle />} title="My Profile" href={`/dashboard/${userId}/profile`} desc="Update your personal information." />
//            {/* Enroll More Programs */}
//          <DashboardCard icon={<FaPlusCircle />} title="Enroll More Programs" href={`/dashboard/${userId}/enroll`} desc="Explore and sign up for new courses." />
//        </main>
//      </div>
//    );
//  }

//  function DashboardCard({ icon, title, href, desc }) {
//    return (
//      <Link href={href} className="bg-white hover:bg-gray-50 transition rounded-2xl shadow p-6 flex items-start space-x-4">
//        <div className="text-[#FE9900] text-2xl">{icon}</div>
//        <div>
//          <h3 className="text-lg font-semibold mb-1">{title}</h3>
//          <p className="text-sm text-gray-600">{desc}</p>
//        </div>
//      </Link>
//    );
//  }


//  "use client";

//  import React, { useState, useEffect } from "react";
//  import Link from "next/link";
//  import { useRouter } from "next/navigation";
//  import { useSession } from "next-auth/react";

//  import {
//    FaUserCircle,
//    FaBookOpen,
//    FaCalendarAlt,
//    FaChartLine,
//    FaDownload,
//    FaSignOutAlt,
//    FaPlusCircle,
//  } from "react-icons/fa";

//  import ResourcesCard from "./ResourcesCard";  ✅ import the smart ResourcesCard

//  export default function TraineeDashboard() {
//    const [loading, setLoading] = useState(true);
//    const router = useRouter();
//    const { data: session } = useSession();
//    const [trainings, setTrainings] = useState([]);

//    const userId = session?.user?.id;

//     ✅ fetch trainings for logged-in trainee
//    useEffect(() => {
//      const fetchTrainings = async () => {
//        const res = await fetch("/api/my-trainings");
//        if (res.ok) {
//          const data = await res.json();
//          setTrainings(data);
//        } else {
//          throw new Error("Failed to fetch trainings");
//        }
//      };
//      if (session) fetchTrainings();
//    }, [session]);

//     ✅ redirect if not a trainee
//    useEffect(() => {
//      const checkTrainee = async () => {
//        const res = await fetch("/api/check-trainee");
//        const data = await res.json();
//        if (!data.isTrainee) {
//          router.push("/register-training");
//        } else {
//          setLoading(false);
//        }
//      };
//      checkTrainee();
//    }, []);

//    if (loading) return <p>Loading...</p>;

//     ✅ build user object for ResourcesCard
//    const user = {
//      _id: userId,
//      role: session?.user?.role,
//      isTrainee: true,  since this dashboard is for trainees
//      tracks: trainings.map((t) => t.track),
//    };

//    return (
//      <div className="min-h-screen bg-gray-100 text-gray-800">
//        {/* Main content */}
//        <main className="max-w-7xl mx-auto p-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//          {/* Welcome Card */}
//          <div className="bg-white rounded-2xl shadow p-6 col-span-full">
//            <h2 className="text-xl font-semibold mb-2">
//              {`Welcome, ${session?.user?.firstName ?? "Guest"} 👋`}
//            </h2>
//            <p className="text-gray-600">
//              You're currently enrolled in:
//              <ul className="list-disc list-inside text-sm text-gray-700">
//                {trainings.map((training, idx) => (
//                  <li key={idx}>
//                    Track: <strong>{training.track}</strong>, Enrolled:{" "}
//                    {new Date(training.enrolledAt).toLocaleDateString()}
//                  </li>
//                ))}
//              </ul>
//              Keep up the great work!
//            </p>
//          </div>

//          {/* Enrolled Training */}
//          <DashboardCard
//            icon={<FaBookOpen />}
//            title="My Trainings"
//            href={`/dashboard/${userId}/my-trainings`}
//            desc="View modules and learning materials."
//          />

//          {/* Schedule */}
//          <DashboardCard
//            icon={<FaCalendarAlt />}
//            title="My Schedule"
//            href={`/dashboard/${userId}/schedule`}
//            desc="Check your training calendar."
//          />

//          {/* Progress Tracker */}
//          <DashboardCard
//            icon={<FaChartLine />}
//            title="Progress Tracker"
//            href={`/dashboard/${userId}/progress`}
//            desc="Track your learning progress."
//          />

//          {/* ✅ Resources (smart version) */}
//          <ResourcesCard user={user} />

//          {/* Profile */}
//          <DashboardCard
//            icon={<FaUserCircle />}
//            title="My Profile"
//            href={`/dashboard/${userId}/profile`}
//            desc="Update your personal information."
//          />

//          {/* Enroll More Programs */}
//          <DashboardCard
//            icon={<FaPlusCircle />}
//            title="Enroll More Programs"
//            href={`/dashboard/${userId}/enroll`}
//            desc="Explore and sign up for new courses."
//          />
//        </main>
//      </div>
//    );
//  }

//  function DashboardCard({ icon, title, href, desc }) {
//    return (
//      <Link
//        href={href}
//        className="bg-white hover:bg-gray-50 transition rounded-2xl shadow p-6 flex items-start space-x-4"
//      >
//        <div className="text-[#FE9900] text-2xl">{icon}</div>
//        <div>
//          <h3 className="text-lg font-semibold mb-1">{title}</h3>
//          <p className="text-sm text-gray-600">{desc}</p>
//        </div>
//      </Link>
//    );
//  }


//  "use client";

//  import React, { useState, useEffect } from "react";
//  import Link from "next/link";
//  import { useRouter } from "next/navigation";
//  import { useSession } from "next-auth/react";
//  import {
//    FaUserCircle,
//    FaBookOpen,
//    FaCalendarAlt,
//    FaChartLine,
//    FaDownload,
//    FaPlusCircle,
//  } from "react-icons/fa";

//  /* ---------- Your existing small card component ---------- */
//  function DashboardCard({ icon, title, href, desc }) {
//    return (
//      <Link
//        href={href}
//        className="bg-white hover:bg-gray-50 transition rounded-2xl shadow p-6 flex items-start space-x-4"
//      >
//        <div className="text-[#FE9900] text-2xl">{icon}</div>
//        <div>
//          <h3 className="text-lg font-semibold mb-1">{title}</h3>
//          <p className="text-sm text-gray-600">{desc}</p>
//        </div>
//      </Link>
//    );
//  }

 /* ---------- NEW: ResourcesCard (inline, no import) ---------- */
 /**
  * Props:
  *  user = {
  *    _id: string,
  *    role: "admin" | "user",
  *    isTrainee: boolean,
  *    tracks?: string[]   from /api/my-trainings
  *  }
  */
//  function ResourcesCard({ user }) {
//    const title = "Resources";
//    const desc = "Download class materials and tools.";
//    const icon = <FaDownload />;

//     Admins → general resources page
//    if (user?.role === "admin") {
//      return (
//        <DashboardCard
//          icon={icon}
//          title={title}
//          href={`/dashboard/${user._id}/resources`}
//          desc={desc}
//        />
//      );
//    }

//     Trainees (regular users who enrolled)
//    if (user?.isTrainee) {
//      const tracks = user.tracks || [];

//       No trainings yet → fallback
//      if (tracks.length === 0) {
//        return (
//          <DashboardCard
//            icon={icon}
//            title={title}
//            href={`/dashboard/${user._id}/resources`}
//            desc={desc}
//          />
//        );
//      }

//       One training → direct link
//      if (tracks.length === 1) {
//        return (
//          <DashboardCard
//            icon={icon}
//            title={title}
//            href={`/dashboard/${user._id}/resources/${encodeURIComponent(
//              tracks[0]
//            )}`}
//            desc={desc}
//          />
//        );
//      }

//       Multiple trainings → simple dropdown-style list
//      return (
//        <div className="bg-white hover:bg-gray-50 transition rounded-2xl shadow p-6 flex flex-col space-y-3">
//          <div className="flex items-center space-x-3">
//            <div className="text-[#FE9900] text-2xl">{icon}</div>
//            <h3 className="text-lg font-semibold">{title}</h3>
//          </div>
//          <p className="text-sm text-gray-600">{desc}</p>

//          <div className="mt-2 space-y-1">
//            {tracks.map((track) => (
//              <a
//                key={track}
//                href={`/dashboard/${user._id}/resources/${encodeURIComponent(
//                  track
//                )}`}
//                className="block text-sm text-blue-600 hover:underline"
//              >
//                {track} Resources
//              </a>
//            ))}
//          </div>
//        </div>
//      );
//    }

//     Plain users (not admin, not trainee) → encourage enrollment
//    return (
//      <DashboardCard
//        icon={icon}
//        title={title}
//        href="/register-training"
//        desc="Enroll in a training program to unlock resources."
//      />
//    );
//  }

//  /* ---------- Your main dashboard ---------- */
//  export default function TraineeDashboard() {
//    const [loading, setLoading] = useState(true);
//    const router = useRouter();
//    const { data: session } = useSession();
//    const [trainings, setTrainings] = useState([]);

//    const userId = session?.user?.id;

//     Fetch trainings
//    useEffect(() => {
//      const fetchTrainings = async () => {
//        const res = await fetch("/api/my-trainings");
//        if (res.ok) {
//          const data = await res.json();
//          setTrainings(data);
//        } else {
//          throw new Error("Failed to fetch trainings");
//        }
//      };
//      if (session) fetchTrainings();
//    }, [session]);

//     Redirect if not a trainee
//    useEffect(() => {
//      const checkTrainee = async () => {
//        const res = await fetch("/api/check-trainee");
//        const data = await res.json();
//        if (!data.isTrainee) {
//          router.push("/register-training");
//        } else {
//          setLoading(false);
//        }
//      };
//      checkTrainee();
//    }, [router]);

//    if (loading) return <p>Loading...</p>;

//     Build the user object the ResourcesCard expects
//    const userForResources = {
//      _id: userId,
//      role: session?.user?.role,                  "admin" | "user"
//      isTrainee: session?.user?.isTrainee === true,
//      tracks: trainings.map((t) => t.track),       ["Automation", "Software Programming", ...]
//    };

//    return (
//      <div className="min-h-screen bg-gray-100 text-gray-800">
//        <main className="max-w-7xl mx-auto p-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//          {/* Welcome Card */}
//          <div className="bg-white rounded-2xl shadow p-6 col-span-full">
//            <h2 className="text-xl font-semibold mb-2">
//              {`Welcome, ${session?.user?.firstName ?? "Guest"} 👋`}
//            </h2>
//            <p className="text-gray-600">
//              You're currently enrolled in:
//              <ul className="list-disc list-inside text-sm text-gray-700">
//                {trainings.map((training, idx) => (
//                  <li key={idx}>
//                    Track: <strong>{training.track}</strong>, Enrolled:{" "}
//                    {new Date(training.enrolledAt).toLocaleDateString()}
//                  </li>
//                ))}
//              </ul>
//              Keep up the great work!
//            </p>
//          </div>

//          {/* Enrolled Training */}
//          <DashboardCard
//            icon={<FaBookOpen />}
//            title="My Trainings"
//            href={`/dashboard/${userId}/my-trainings`}
//            desc="View modules and learning materials."
//          />

//          {/* Schedule */}
//          <DashboardCard
//            icon={<FaCalendarAlt />}
//            title="My Schedule"
//            href={`/dashboard/${userId}/schedule`}
//            desc="Check your training calendar."
//          />

//          {/* Progress Tracker */}
//          <DashboardCard
//            icon={<FaChartLine />}
//            title="Progress Tracker"
//            href={`/dashboard/${userId}/progress`}
//            desc="Track your learning progress."
//          />

//          {/* ✅ Resources (now smart) */}
//          <ResourcesCard user={userForResources} />

//          {/* Profile */}
//          <DashboardCard
//            icon={<FaUserCircle />}
//            title="My Profile"
//            href={`/dashboard/${userId}/profile`}
//            desc="Update your personal information."
//          />

//          {/* Enroll More Programs */}
//          <DashboardCard
//            icon={<FaPlusCircle />}
//            title="Enroll More Programs"
//            href={`/dashboard/${userId}/enroll`}
//            desc="Explore and sign up for new courses."
//          />
//        </main>
//      </div>
//    );
//  }


//  "use client";

//  import React, { useState, useEffect } from "react";
//  import Link from "next/link";
//  import { useRouter } from "next/navigation";
//  import LemLoader from "@/components/loaders/LemLoader";
//  import { useSession } from "next-auth/react";
//  import {
//    FaUserCircle,
//    FaBookOpen,
//    FaCalendarAlt,
//    FaChartLine,
//    FaDownload,
//    FaPlusCircle,
//  } from "react-icons/fa";
//  import { slugify } from "@/utils/slugify";  //✅ import slugify

//  /* ---------- Small card component ---------- */
//  function DashboardCard({ icon, title, href, desc }) {
//    return (
//      <Link
//        href={href}
//        className="bg-white hover:bg-gray-50 transition rounded-2xl shadow p-6 flex items-start space-x-4"
//      >
//        <div className="text-[#FE9900] text-2xl">{icon}</div>
//        <div>
//          <h3 className="text-lg font-semibold mb-1">{title}</h3>
//          <p className="text-sm text-gray-600">{desc}</p>
//        </div>
//      </Link>
//    );
//  }

//  /* ---------- ✅ Updated ResourcesCard (slugified) ---------- */
//  function ResourcesCard({ user }) {
//    const title = "Resources";
//    const desc = "Download class materials and tools.";
//    const icon = <FaDownload />;

//     //Admins → general resources page
//    if (user?.role === "admin") {
//      return (
//        <DashboardCard
//          icon={icon}
//          title={title}
//          href={`/dashboard/${user._id}/resources`}
//          desc={desc}
//        />
//      );
//    }

//     //Trainees (regular users who enrolled)
//    if (user?.isTrainee) {
//      const tracks = user.tracks || [];

//       //No trainings yet → fallback
//      if (tracks.length === 0) {
//        return (
//          <DashboardCard
//            icon={icon}
//            title={title}
//            href={`/dashboard/${user._id}/resources`}
//            desc={desc}
//          />
//        );
//      }

//      // One training → direct link (slugified!)
//      if (tracks.length === 1) {
//        return (
//          <DashboardCard
//            icon={icon}
//            title={title}
//            href={`/dashboard/${user._id}/resources/${slugify(tracks[0])}`}
//            desc={desc}
//          />
//        );
//      }

//      // Multiple trainings → dropdown list (slugified!)
//      return (
//        <div className="bg-white hover:bg-gray-50 transition rounded-2xl shadow p-6 flex flex-col space-y-3">
//          <div className="flex items-center space-x-3">
//            <div className="text-[#FE9900] text-2xl">{icon}</div>
//            <h3 className="text-lg font-semibold">{title}</h3>
//          </div>
//          <p className="text-sm text-gray-600">{desc}</p>

//          <div className="mt-2 space-y-1">
//            {tracks.map((track) => (
//              <Link
//                key={track}
//                href={`/dashboard/${user._id}/resources/${slugify(track)}`}
//                className="block text-sm text-blue-600 hover:underline"
//              >
//                {track} Resources
//              </Link>
//            ))}
//          </div>
//        </div>
//      );
//    }

//    // Plain users (not admin, not trainee) → encourage enrollment
//    return (
//      <DashboardCard
//        icon={icon}
//        title={title}
//        href="/register-training"
//        desc="Enroll in a training program to unlock resources."
//      />
//    );
//  }

//  /* ---------- Main dashboard ---------- */
//  export default function TraineeDashboard() {
//    const [loading, setLoading] = useState(true);
//    const router = useRouter();
//    const { data: session } = useSession();
//    const [trainings, setTrainings] = useState([]);

//    const userId = session?.user?.id;

//     //Fetch trainings
//    useEffect(() => {
//      const fetchTrainings = async () => {
//        const res = await fetch("/api/my-trainings");
//        if (res.ok) {
//          const data = await res.json();
//          setTrainings(data);
//        } else {
//          throw new Error("Failed to fetch trainings");
//        }
//      };
//      if (session) fetchTrainings();
//    }, [session]);

//     //Redirect if not a trainee
//    useEffect(() => {
//      const checkTrainee = async () => {
//        const res = await fetch("/api/check-trainee");
//        const data = await res.json();
//        if (!data.isTrainee) {
//          router.push("/register-training");
//        } else {
//          setLoading(false);
//        }
//      };
//      checkTrainee();
//    }, [router]);

//    if (loading) return <LemLoader/>;

//    // Build the user object the ResourcesCard expects
//    const userForResources = {
//      _id: userId,
//      role: session?.user?.role,  //"admin" | "user",
//      isTrainee: session?.user?.isTrainee === true,
//      tracks: trainings.map((t) => t.track),  ["Automation", "Software Programming", "Electrical Engineering"]
//    };

//    return (
//      <div className="min-h-screen bg-gray-100 text-gray-800">
//        <main className="max-w-7xl mx-auto p-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//          {/* Welcome Card */}
//          <div className="bg-white rounded-2xl shadow p-6 col-span-full">
//            <h2 className="text-xl font-semibold mb-2">
//              {`Welcome, ${session?.user?.firstName ?? "Guest"} 👋`}
//            </h2>
//            <p className="text-gray-600">
//              You're currently enrolled in:
//              <ul className="list-disc list-inside text-sm text-gray-700">
//                {trainings.map((training, idx) => (
//                  <li key={idx}>
//                    Track: <strong>{training.track}</strong>, Enrolled:{" "}
//                    {new Date(training.enrolledAt).toLocaleDateString()}
//                  </li>
//                ))}
//              </ul>
//              Keep up the great work!
//            </p>
//          </div>

//          {/* Enrolled Training */}
//          <DashboardCard
//            icon={<FaBookOpen />}
//            title="My Trainings"
//            href={`/dashboard/${userId}/my-trainings`}
//            desc="View modules and learning materials."
//          />

//          {/* Schedule */}
//          <DashboardCard
//            icon={<FaCalendarAlt />}
//            title="My Schedule"
//            href={`/dashboard/${userId}/schedule`}
//            desc="Check your training calendar."
//          />

//          {/* Progress Tracker */}
//          <DashboardCard
//            icon={<FaChartLine />}
//            title="Progress Tracker"
//            href={`/dashboard/${userId}/progress`}
//            desc="Track your learning progress."
//          />

//          {/* ✅ Resources (slugified links) */}
//          <ResourcesCard user={userForResources} />

//          {/* Profile */}
//          <DashboardCard
//            icon={<FaUserCircle />}
//            title="My Profile"
//            href={`/dashboard/${userId}/profile`}
//            desc="Update your personal information."
//          />

//          {/* Enroll More Programs */}
//          <DashboardCard
//            icon={<FaPlusCircle />}
//            title="Enroll More Programs"
//            href={`/dashboard/${userId}/enroll`}
//            desc="Explore and sign up for new courses."
//          />
//        </main>
//      </div>
//    );
//  }




"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import LemLoader from "@/components/loaders/LemLoader";
import { useSession } from "next-auth/react";
import {
   FaUserCircle,
  FaBookOpen,
  FaCalendarAlt,
  FaChartLine,
  FaDownload,
  FaPlusCircle,
} from "react-icons/fa";
import { slugify } from "@/utils/slugify";
import toast from "react-hot-toast";
import Trainee from "@/models/Trainee";
import User from "@/models/User";


  function DashboardCard({ icon, title, href, desc }) {
    return (
      <Link
        href={href}
        className="bg-white hover:bg-gray-50 transition rounded-2xl shadow p-6 flex items-start space-x-4"
      >
        <div className="text-[#FE9900] text-2xl">{icon}</div>
      <div>
          <h3 className="text-lg font-semibold mb-1">{title}</h3>
          <p className="text-sm text-gray-600">{desc}</p>
        </div>
      </Link>
    );
  }

  function ResourcesCard({ user }) {
    const title = "Resources";
    const desc = "Download class materials and tools.";
   const icon = <FaDownload />;
  

  
     //Admins → general resources page
    if (user?.role === "admin") {
      return (
        <DashboardCard
          icon={icon}
          title={title}
          href={`/dashboard/resources`}
          desc={desc}
        />
      );
    }

     //Trainees (regular users who enrolled)
    if (user?.isTrainee) {
      const tracks = user.tracks || [];

       //No trainings yet → fallback
      if (tracks.length === 0) {
        return (
          <DashboardCard
            icon={icon}
            title={title}
            href={"/register-training"}
            desc={desc}
          />
        );
      }

      // One training → direct link (slugified!)
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

      // Multiple trainings → dropdown list (slugified!)
      return (
        <div className="bg-white hover:bg-gray-50 transition rounded-2xl shadow p-6 flex flex-col space-y-3">
          <div className="flex items-center space-x-3">
            <div className="text-[#FE9900] text-2xl">{icon}</div>
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
          <p className="text-sm text-gray-600">{desc}</p>

          <div className="mt-2 space-y-1">
            {tracks.map((track) => (
              <Link
                key={track}
                href={`/dashboard/resources/${slugify(track)}`}
                className="block text-sm text-blue-600 hover:underline"
              >
                {track} Resources
              </Link>
            ))}
          </div>
        </div>
      );
    }

    // Plain users (not admin, not trainee) → encourage enrollment
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
  //const searchParams = useSearchParams()
  const { data: session, status} = useSession()
  //const [trainings, setTrainings] = useState([]);
  const trainings = session?.user?.trainings || [];

  const userId = session?.user?.id;
  const traineeId = session.user._traineeId || session.traineeId;
  const [isStillTrainee, setIsStillTrainee] = useState(false);

  useEffect(() => {
    if (status === "loading") return; // wait until session is ready

    if (!session) {
      // not logged in → go to login
      router.replace("/login");
      return;
    }

    const isAdmin = session.user.role === "admin";
    const isTrainee = session.user.isTrainee;

   // ✅ FIX: Verify trainee existence server-side
    if (!isAdmin && isTrainee) {
      fetch(`/api/trainee/check`)
        .then((res) => res.json())
        .then((data) => {
          if (!data.exists) {
            toast.error("Your trainee record was removed. Please re-enroll.");
            router.replace("/register-training");
          } else {
            setIsStillTrainee(true);
            setLoading(false);
          }
        })
        .catch(() => {
          toast.error("Error verifying trainee status.");
          router.replace("/register-training");
        });
      return;
    }

    // if not admin and not trainee → kick out
    if (!isAdmin && !isTrainee) {
      router.replace("/register-training");
      return;
    }

    // ✅ trainee or admin confirmed
    setLoading(false);
  }, [status, session, router, userId]);


  if(loading) return <LemLoader/>;

     //Build user object for ResourcesCard
  const userForResources = {
    _id: userId,
    role: session?.user?.role,
    isTrainee: isStillTrainee,
    tracks: trainings.map((t) => t.track),
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <main className="max-w-7xl mx-auto p-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* your existing dashboard content here */}

           {/* Welcome Card */}
        <div className="bg-white rounded-2xl shadow p-6 col-span-full">
           <h2 className="text-xl font-semibold mb-2">
             {`Welcome, ${session?.user?.firstName ?? "Guest"} 👋`}
           </h2>
           <div className="text-gray-600">
             You're currently enrolled in:
             <ul className="list-disc list-inside text-sm text-gray-700">
               {trainings.map((training, idx) => (
                 <li key={idx}>
                   Track: <strong>{training.track}</strong>, Enrolled:{" "}
                   {new Date(training.enrolledAt).toLocaleDateString()}
                 </li>
               ))}
             </ul>
             Keep up the great work!
           </div>
         </div>

         {/* Enrolled Training */}
         <DashboardCard
           icon={<FaBookOpen />}
           title="My Trainings"
           href={`/dashboard/my-trainings`}
           desc="View modules and learning materials."
         />

         {/* Schedule */}
         <DashboardCard
           icon={<FaCalendarAlt />}
           title="My Schedule"
           href={`/dashboard/schedule`}
           desc="Check your training calendar."
         />

         {/* Progress Tracker */}
         <DashboardCard
           icon={<FaChartLine />}
           title="Progress Tracker"
           href={`/dashboard/${userId}/progress`}
           desc="Track your learning progress."
         />

         {/* ✅ Resources (slugified links) */}
         <ResourcesCard user={userForResources} />

         {/* Profile */}
         <DashboardCard
           icon={<FaUserCircle />}
           title="My Profile"
           href={`/dashboard/profile`}
           desc="Update your personal information."
         />

         {/* Enroll More Programs */}
         <DashboardCard
           icon={<FaPlusCircle />}
           title="Enroll More Programs"
           href={`/dashboard/enroll-more`}
           desc="Explore and sign up for new courses."
         />
      </main>
    </div>
  );

}