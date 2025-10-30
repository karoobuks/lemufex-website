"use client";

import { useEffect, useState } from "react";
import {FaArrowLeft} from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function SchedulePage() {
  const [latest, setLatest] = useState(null);
  const [history, setHistory] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const [l, h] = await Promise.all([
        fetch("/api/schedules/latest", { cache: "no-store" }).then((r) => r.json()),
        fetch("/api/schedules", { cache: "no-store" }).then((r) => r.json()),
      ]);
      setLatest(l.data || null);
      setHistory(h.data || []);
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <header className="bg-[#002D62] text-white px-6 py-10 shadow">
        <h1 className="text-3xl font-bold">Training Schedule</h1>
        <p className="text-[#E5E7EB]">Always up to date • Versioned history</p>
      </header>
         <div>    
   <button 
          onClick={() => router.back()}
           className="inline-flex items-center gap-2 text-[#002B5B] hover:text-[#FE9900] mb-4 transition-colors"
        >
   <FaArrowLeft /> Back to Dashboard
    </button>
    </div> 
      <main className="max-w-6xl mx-auto p-6 grid lg:grid-cols-3 gap-6">
        
        {/* Latest */}
        <section className="lg:col-span-2 bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold text-[#002D62] mb-4">Latest Schedule</h2>
          {!latest ? (
            <p className="text-gray-600">No schedule uploaded yet.</p>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="font-medium text-gray-800">
                  v{latest.versionNumber} — {latest.title}
                </p>
                <a
                  href={latest.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#FE9900] hover:bg-[#e88500] text-white px-4 py-2 rounded-lg"
                >
                  Open PDF
                </a>
              </div>
              <div className="aspect-[4/3] w-full border rounded-xl overflow-hidden bg-[#E5E7EB]">
                <iframe
                  title="Latest Schedule"
                  src={latest.fileUrl}
                  className="w-full h-full"
                />
              </div>
            </>
          )}
        </section>

        {/* Version history */}
        <aside className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-lg font-semibold text-[#002D62] mb-4">Version History</h3>
          {history.length === 0 ? (
            <p className="text-gray-600">Nothing here yet.</p>
          ) : (
            <ul className="space-y-3">
              {history.map((s) => (
                <li key={s._id} className="border rounded-xl p-3 hover:bg-[#F5F5F5]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800">
                        v{s.versionNumber} — {s.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(s.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <a
                      href={s.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#FE9900] font-semibold"
                    >
                      View
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </main>
    </div>
  );
}
