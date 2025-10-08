// "use client";
// import { useEffect, useState } from "react";

// export default function ResourcesPage() {
//   const [resources, setResources] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchResources = async () => {
//       const res = await fetch("/api/resources");
//       const data = await res.json();
//       setResources(data);
//       setLoading(false);
//     };
//     fetchResources();
//   }, []);

//   if (loading) return <p className="text-center text-gray-400">Loading resources...</p>;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white p-8">
//       <h1 className="text-4xl font-bold text-[#EAB308] mb-8 text-center">Resources</h1>

//       <div className="max-w-4xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//         {resources.length === 0 ? (
//           <p className="text-center text-gray-400 col-span-full">No resources available yet</p>
//         ) : (
//           resources.map((r) => (
//             <div key={r._id} className="bg-[#1E293B] p-6 rounded-xl shadow border border-[#EAB308]/40">
//               <h2 className="text-lg font-semibold">{r.title}</h2>
//               <p className="text-sm text-gray-300 mt-1">{r.description}</p>
//                <p className="text-xs mt-2 text-[#EAB308] font-semibold uppercase">
//                 Track: {r.track}
//               </p>
//               <a
//                 href={r.fileUrl}
//                 download
//                 target="_blank"
//                 className="inline-block mt-4 bg-[#EAB308] text-black px-4 py-2 rounded font-semibold hover:bg-[#FACC15]"
//               >
//                 Download
//               </a>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }


"use client";
import { useEffect, useState } from "react";

export default function ResourcesPage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      const res = await fetch("/api/resources");
      const data = await res.json();
      setResources(data);
      setLoading(false);
    };
    fetchResources();
  }, []);

  if (loading) return <p className="text-center text-gray-400">Loading resources...</p>;

  if (resources.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white p-8 flex items-center justify-center">
        <p className="text-gray-400 text-lg">No resources available yet</p>
      </div>
    );
  }

  // ✅ Group resources by track
  const grouped = resources.reduce((acc, res) => {
    if (!acc[res.track]) acc[res.track] = [];
    acc[res.track].push(res);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white p-8">
      <h1 className="text-4xl font-bold text-[#EAB308] mb-8 text-center">Resources</h1>

      <div className="space-y-12 max-w-6xl mx-auto">
        {Object.keys(grouped).map((track) => (
          <section key={track}>
            <h2 className="text-2xl font-bold text-[#EAB308] mb-4 border-b border-[#EAB308]/40 pb-2">
              {track} Resources
            </h2>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {grouped[track].map((r) => (
                <div
                  key={r._id}
                  className="bg-[#1E293B] p-6 rounded-xl shadow border border-[#EAB308]/40"
                >
                  <h3 className="text-lg font-semibold">{r.title}</h3>
                  <p className="text-sm text-gray-300 mt-1">{r.description}</p>
                  <a
                    href={r.fileUrl}
                    download
                    target="_blank" rel="noopener noreferrer"
                    className="inline-block mt-4 bg-[#EAB308] text-black px-4 py-2 rounded font-semibold hover:bg-[#FACC15]"
                  >
                    Download
                  </a>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
