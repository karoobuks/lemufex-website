// // // app/resources/[track]/page.js
// // import { notFound } from "next/navigation";

// // async function getResources(track) {
// //   const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/resources/${track}`, {
// //     cache: "no-store",
// //   });

// //   if (!res.ok) return null;
// //   return res.json();
// // }

// // export default async function TrackResourcesPage({ params }) {
// //   const { track } = params;
// //   const data = await getResources(track);

// //   if (!data) {
// //     return notFound();
// //   }

// //   return (
// //     <div className="p-6">
// //       <h1 className="text-2xl font-bold mb-4">{track} Resources</h1>
// //       <ul className="space-y-2">
// //         {data.resources.map((r) => (
// //           <li key={r._id} className="border p-3 rounded-md shadow-sm">
// //             <a
// //               href={r.url}
// //               target="_blank"
// //               rel="noopener noreferrer"
// //               className="text-blue-600 hover:underline"
// //             >
// //               {r.title}
// //             </a>
// //           </li>
// //         ))}
// //       </ul>
// //     </div>
// //   );
// // }


// // app/dashboard/[userId]/resources/[track]/page.jsx
// import { notFound } from "next/navigation";

// async function getResources(track) {
//   try {
//     // ✅ Safer base URL handling
//     const baseUrl =
//       process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000";

//     const res = await fetch(`${baseUrl}/api/resources/${encodeURIComponent(track)}`, {
//       cache: "no-store",
//     });

//     if (!res.ok) return null;
//     return res.json();
//   } catch (err) {
//     console.error("Error fetching resources:", err);
//     return null;
//   }
// }

// export default async function TrackResourcesPage({ params }) {
//   const track = params?.track;

//   if (!track) {
//     console.error("No track param found in route.");
//     return notFound();
//   }

//   const data = await getResources(track);

//   if (!data || !data.resources || data.resources.length === 0) {
//     return (
//       <div className="p-6 text-center">
//         <h1 className="text-2xl font-bold mb-2">{track} Resources</h1>
//         <p className="text-gray-500">No resources found for this track yet.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">{track} Resources</h1>
//       <ul className="space-y-3">
//         {data.resources.map((r) => (
//           <li
//             key={r._id}
//             className="bg-white p-4 rounded-xl shadow border border-gray-200"
//           >
//             <h2 className="text-lg font-semibold text-gray-800">{r.title}</h2>
//             {r.description && (
//               <p className="text-sm text-gray-600 mt-1">{r.description}</p>
//             )}
//             <a
//               href={r.fileUrl}
//               download
//               target="_blank"
//               rel="noopener noreferrer"
//               className="inline-block mt-3 bg-[#EAB308] text-black px-4 py-2 rounded font-semibold hover:bg-[#FACC15]"
//             >
//               Download
//             </a>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }


// // app/dashboard/[userId]/resources/[track]/page.jsx
// import { notFound } from "next/navigation";
// import { trackMap } from "@/utils/trackMap"; // ✅ import mapping

// async function getResources(trackSlug) {
//   try {
//     const baseUrl =
//       process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000";

//     // Convert slug to real track name (e.g., "software-programming" → "Software Programming")
//     const realTrack = trackMap[trackSlug];

//     if (!realTrack) return null;

//     const res = await fetch(
//       `${baseUrl}/api/resources/${encodeURIComponent(realTrack)}`,
//       { cache: "no-store" }
//     );

//     if (!res.ok) return null;
//     return res.json();
//   } catch (err) {
//     console.error("Error fetching resources:", err);
//     return null;
//   }
// }

// export default async function TrackResourcesPage({ params }) {
//   const trackSlug = params?.track;
//   const realTrack = trackMap[trackSlug];

//   if (!realTrack) {
//     console.error("Invalid track slug:", trackSlug);
//     return notFound();
//   }

//   const data = await getResources(trackSlug);

//   if (!data || !data.resources || data.resources.length === 0) {
//     return (
//       <div className="p-6 text-center">
//         <h1 className="text-2xl font-bold mb-2">{realTrack} Resources</h1>
//         <p className="text-gray-500">No resources found for this track yet.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">{realTrack} Resources</h1>
//       <ul className="space-y-3">
//         {data.resources.map((r) => (
//           <li
//             key={r._id}
//             className="bg-white p-4 rounded-xl shadow border border-gray-200"
//           >
//             <h2 className="text-lg font-semibold text-gray-800">{r.title}</h2>
//             {r.description && (
//               <p className="text-sm text-gray-600 mt-1">{r.description}</p>
//             )}
//             <a
//               href={r.fileUrl}
//               download
//               target="_blank"
//               rel="noopener noreferrer"
//               className="inline-block mt-3 bg-[#EAB308] text-black px-4 py-2 rounded font-semibold hover:bg-[#FACC15]"
//             >
//               Download
//             </a>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// app/dashboard/[userId]/resources/[track]/page.jsx
// import { notFound } from "next/navigation";
// import { reverseSlugify } from "@/utils/slugify";

// async function getResources(trackSlug) {
//   try {
//     const baseUrl =
//       process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000";

//     // Convert slug → real track name (for API call)
//     const realTrack = reverseSlugify(trackSlug);

//     const res = await fetch(
//       `${baseUrl}/api/resources/${encodeURIComponent(trackSlug)}`, // 🔑 we now pass slug directly
//       { cache: "no-store" }
//     );

//     if (!res.ok) return null;
//     return res.json();
//   } catch (err) {
//     console.error("Error fetching resources:", err);
//     return null;
//   }
// }

// export default async function TrackResourcesPage({ params }) {
//   const trackSlug = params?.track;
//   if (!trackSlug) return notFound();

//   const realTrack = reverseSlugify(trackSlug);
//   const data = await getResources(trackSlug);

//   if (!data || !data.resources || data.resources.length === 0) {
//     return (
//       <div className="p-6 text-center">
//         <h1 className="text-2xl font-bold mb-2">{realTrack} Resources</h1>
//         <p className="text-gray-500">No resources found for this track yet.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">{realTrack} Resources</h1>
//       <ul className="space-y-3">
//         {data.resources.map((r) => (
//           <li
//             key={r._id}
//             className="bg-white p-4 rounded-xl shadow border border-gray-200"
//           >
//             <h2 className="text-lg font-semibold text-gray-800">{r.title}</h2>
//             {r.description && (
//               <p className="text-sm text-gray-600 mt-1">{r.description}</p>
//             )}
//             <a
//               href={r.fileUrl}
//               download
//               target="_blank"
//               rel="noopener noreferrer"
//               className="inline-block mt-3 bg-[#EAB308] text-black px-4 py-2 rounded font-semibold hover:bg-[#FACC15] transition"
//             >
//               Download
//             </a>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }


// app/dashboard/resources/[track]/page.jsx
import { notFound } from "next/navigation";
import { reverseSlugify } from "@/utils/slugify";
import { cookies } from "next/headers";

async function getResources(track) {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000";

      const cookieHeader = cookies().toString();

    const res = await fetch(
      `${baseUrl}/api/resources/${encodeURIComponent(track)}`,
      { cache: "no-store",
        headers:{
          Cookie: cookieHeader, // 👈 pass cookies manually
        },
       }
    );

    if (!res.ok) return null;
    return res.json();
  } catch (err) {
    console.error("Error fetching resources:", err);
    return null;
  }
}

export default async function TrackResourcesPage({ params }) {
  const trackSlug = params?.track;
  if (!trackSlug) return notFound();

  const realTrack = reverseSlugify(trackSlug);
   const normalizedRealTrack = realTrack.toLowerCase(); 

  const data = await getResources(trackSlug);

  if (!data || !data.resources || data.resources.length === 0) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-2">{realTrack} Resources</h1>
        <p className="text-gray-500">No resources found for this track yet.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{normalizedRealTrack.charAt(0).toUpperCase() +
            normalizedRealTrack.slice(1)}{" "} Resources</h1>
      <ul className="space-y-3">
        {data.resources.map((r) => (
          <li
            key={r._id}
            className="bg-white p-4 rounded-xl shadow border border-gray-200"
          >
            <h2 className="text-lg font-semibold text-gray-800">{r.title}</h2>
            {r.description && (
              <p className="text-sm text-gray-600 mt-1">{r.description}</p>
            )}

            {/* ✅ Use API route instead of Cloudinary URL directly */}
            <a
              href={`/api/resources/download/${r._id}`} // 🔑 goes through backend proxy
              className="inline-block mt-3 bg-[#EAB308] text-black px-4 py-2 rounded font-semibold hover:bg-[#FACC15] transition"
            >
              Download
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
