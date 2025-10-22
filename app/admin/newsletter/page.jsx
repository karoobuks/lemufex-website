

// 'use client';
// import { useState, useEffect } from 'react';
// import { FaEnvelope, FaUsers, FaUserCheck, FaUserTimes, FaDownload, FaSearch, FaTrash } from 'react-icons/fa';
// import toast from 'react-hot-toast';

// export default function NewsletterPage() {
//   const [subscribers, setSubscribers] = useState([]);
//   const [stats, setStats] = useState({ total: 0, active: 0, unsubscribed: 0 });
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState('');
//   const [page, setPage] = useState(1);
//   const [limit] = useState(10);
//   const [total, setTotal] = useState(0);

//   useEffect(() => { fetchSubscribers(); }, [page, search]);

//   const fetchSubscribers = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch(`/api/newsletter?search=${search}&page=${page}&limit=${limit}`);
//       const data = await res.json();
//       if (res.ok) {
//         setSubscribers(data.subscribers);
//         setStats(data.stats);
//         setTotal(data.total);
//       } else toast.error('Failed to load subscribers');
//     } catch {
//       toast.error('Error fetching data');
//     } finally { setLoading(false); }
//   };

//   const toggleStatus = async (id) => {
//     try {
//       const res = await fetch(`/api/newsletter/${id}`, { method: 'PATCH' });
//       const data = await res.json();
//       if (res.ok) {
//         toast.success('Status updated');
//         setSubscribers(prev =>
//           prev.map(sub => sub._id === id ? { ...sub, status: data.subscriber.status } : sub)
//         );
//       } else toast.error(data.message || 'Error updating status');
//     } catch {
//       toast.error('Server error');
//     }
//   };

//   const deleteSubscriber = async (id) => {
//     if (!confirm('Are you sure you want to permanently delete this subscriber?')) return;

//     try {
//       const res = await fetch(`/api/newsletter/${id}`, { method: 'DELETE' });
//       const data = await res.json();
//       if (res.ok) {
//         toast.success('Subscriber deleted');
//         setSubscribers(prev => prev.filter(sub => sub._id !== id));
//       } else toast.error(data.message || 'Error deleting subscriber');
//     } catch {
//       toast.error('Server error');
//     }
//   };

//   const exportSubscribers = () => {
//     const csv = [
//       ['Email', 'Name', 'Status', 'Subscribed Date'],
//       ...subscribers.map(s => [s.email, s.name, s.status, new Date(s.subscribedAt).toLocaleDateString()])
//     ].map(r => r.join(',')).join('\n');

//     const blob = new Blob([csv], { type: 'text/csv' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `newsletter-${new Date().toISOString().split('T')[0]}.csv`;
//     a.click();
//   };

//   const totalPages = Math.ceil(total / limit);

//   return (
//     <div className="p-6 bg-[#F8F9FC] min-h-screen">
//       <div className="max-w-7xl mx-auto">
//         <h1 className="text-3xl font-bold text-[#081C3C] flex items-center gap-3 mb-2">
//           <FaEnvelope className="text-[#FE9900]" /> Newsletter Management
//         </h1>
//         <p className="text-gray-600 mb-6">Manage your newsletter subscribers and track engagement</p>

//         {/* Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//           <Stat label="Total Subscribers" value={stats.total} icon={<FaUsers />} color="text-[#081C3C]" />
//           <Stat label="Active Subscribers" value={stats.active} icon={<FaUserCheck />} color="text-green-600" />
//           <Stat label="Unsubscribed" value={stats.unsubscribed} icon={<FaUserTimes />} color="text-red-600" />
//         </div>

//         {/* Search + Export */}
//         <div className="bg-white rounded-xl shadow-sm border p-4 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
//           <div className="relative flex-1 max-w-md">
//             <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search subscribers..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#FE9900]"
//             />
//           </div>
//           <button
//             onClick={exportSubscribers}
//             className="bg-[#FE9900] hover:bg-[#F8C400] text-white px-4 py-2 rounded-lg flex items-center gap-2"
//           >
//             <FaDownload /> Export CSV
//           </button>
//         </div>

//         {/* Table */}
//         <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
//           {loading ? (
//             <div className="text-center py-8 text-gray-500">Loading...</div>
//           ) : (
//             <table className="w-full">
//               <thead className="bg-gray-50 border-b">
//                 <tr>
//                   <th className="py-3 px-6 text-left">Email</th>
//                   <th className="py-3 px-6 text-left">Name</th>
//                   <th className="py-3 px-6 text-left">Status</th>
//                   <th className="py-3 px-6 text-left">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {subscribers.length === 0 ? (
//                   <tr><td colSpan="4" className="text-center py-8 text-gray-500">No subscribers</td></tr>
//                 ) : (
//                   subscribers.map(sub => (
//                     <tr key={sub._id} className="border-b hover:bg-gray-50">
//                       <td className="px-6 py-4">{sub.email}</td>
//                       <td className="px-6 py-4">{sub.name || '-'}</td>
//                       <td className="px-6 py-4">
//                         <span className={`px-3 py-1 rounded-full text-xs ${
//                           sub.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                         }`}>
//                           {sub.status}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 flex gap-2">
//                         <button
//                           onClick={() => toggleStatus(sub._id)}
//                           className={`px-3 py-1 text-xs rounded-lg ${
//                             sub.status === 'active'
//                               ? 'bg-red-100 text-red-700 hover:bg-red-200'
//                               : 'bg-green-100 text-green-700 hover:bg-green-200'
//                           }`}
//                         >
//                           {sub.status === 'active' ? 'Unsubscribe' : 'Reactivate'}
//                         </button>
//                         <button
//                           onClick={() => deleteSubscriber(sub._id)}
//                           className="px-3 py-1 text-xs rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center gap-1"
//                         >
//                           <FaTrash /> Delete
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           )}
//         </div>

//         {/* Pagination */}
//         <div className="flex justify-between items-center mt-6">
//           <button
//             disabled={page === 1}
//             onClick={() => setPage(p => p - 1)}
//             className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
//           >
//             Previous
//           </button>
//           <p>Page {page} of {totalPages}</p>
//           <button
//             disabled={page === totalPages}
//             onClick={() => setPage(p => p + 1)}
//             className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// function Stat({ label, value, icon, color }) {
//   return (
//     <div className="bg-white rounded-xl shadow-sm border p-6 flex items-center justify-between">
//       <div>
//         <p className="text-sm text-gray-600 mb-1">{label}</p>
//         <p className="text-2xl font-bold text-[#081C3C]">{value}</p>
//       </div>
//       <div className={`text-3xl ${color}`}>{icon}</div>
//     </div>
//   );
// }



'use client';
import { useState, useEffect } from 'react';
import {
  FaEnvelope,
  FaUsers,
  FaUserCheck,
  FaUserTimes,
  FaDownload,
  FaSearch,
  FaTrash,
} from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, unsubscribed: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchSubscribers();
  }, [page, search]);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/newsletter?search=${search}&page=${page}&limit=${limit}`
      );
      const data = await res.json();
      if (res.ok) {
        setSubscribers(data.subscribers);
        setStats(data.stats);
        setTotal(data.total);
      } else toast.error('Failed to load subscribers');
    } catch {
      toast.error('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id) => {
    try {
      const res = await fetch(`/api/newsletter/${id}`, { method: 'PATCH' });
      const data = await res.json();
      if (res.ok) {
        toast.success('Status updated');
        setSubscribers((prev) =>
          prev.map((sub) =>
            sub._id === id
              ? { ...sub, status: data.subscriber.status }
              : sub
          )
        );
      } else toast.error(data.message || 'Error updating status');
    } catch {
      toast.error('Server error');
    }
  };

  const deleteSubscriber = async (id) => {
    if (!confirm('Are you sure you want to permanently delete this subscriber?'))
      return;

    try {
      const res = await fetch(`/api/newsletter/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        toast.success('Subscriber deleted');
        setSubscribers((prev) => prev.filter((sub) => sub._id !== id));
      } else toast.error(data.message || 'Error deleting subscriber');
    } catch {
      toast.error('Server error');
    }
  };

  const exportSubscribers = () => {
    const csv = [
      ['Email', 'Name', 'Status', 'Subscribed Date'],
      ...subscribers.map((s) => [
        s.email,
        s.name,
        s.status,
        new Date(s.subscribedAt).toLocaleDateString(),
      ]),
    ]
      .map((r) => r.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-6 bg-[#F4F6FA] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[#081C3C] flex items-center gap-3 mb-2">
          <FaEnvelope className="text-[#FE9900]" /> Newsletter Management
        </h1>
        <p className="text-gray-700 mb-6">
          Manage your newsletter subscribers and track engagement
        </p>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Stat
            label="Total Subscribers"
            value={stats.total}
            icon={<FaUsers />}
            color="text-[#081C3C]"
          />
          <Stat
            label="Active Subscribers"
            value={stats.active}
            icon={<FaUserCheck />}
            color="text-green-600"
          />
          <Stat
            label="Unsubscribed"
            value={stats.unsubscribed}
            icon={<FaUserTimes />}
            color="text-red-600"
          />
        </div>

        {/* Search + Export */}
        <div className="bg-white rounded-xl shadow-md border p-4 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search subscribers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FE9900] focus:border-[#FE9900]"
            />
          </div>
          <button
            onClick={exportSubscribers}
            className="bg-[#FE9900] hover:bg-[#E68900] text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <FaDownload /> Export CSV
          </button>
        </div>

        {/* Send Newsletter */}
          <div className="bg-white rounded-xl text-gray-700 shadow-sm border p-6 mb-6">
            <h2 className="text-xl font-bold text-[#081C3C] mb-4 flex items-center gap-2">
              <FaEnvelope className="text-[#FE9900]" /> Send Newsletter
            </h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const subject = e.target.subject.value;
                const message = e.target.message.value;

                if (!subject || !message) {
                  toast.error("Please fill in all fields");
                  return;
                }

                toast.loading("Sending newsletter...");
                try {
                  const res = await fetch("/api/newsletter/send", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ subject, message }),
                  });

                  const data = await res.json();
                  if (res.ok) {
                    toast.dismiss();
                    toast.success("Newsletter sent successfully!");
                    e.target.reset();
                  } else {
                    toast.dismiss();
                    toast.error(data.message || "Error sending newsletter");
                  }
                } catch (err) {
                  toast.dismiss();
                  toast.error("Server error");
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  name="subject"
                  placeholder="Enter newsletter subject"
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-[#FE9900]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  name="message"
                  rows="5"
                  placeholder="Write your newsletter content here..."
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-[#FE9900]"
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-[#FE9900] hover:bg-[#F8C400] text-white px-6 py-2 rounded-lg flex items-center gap-2"
              >
                <FaEnvelope /> Send Newsletter
              </button>
            </form>
          </div>


        {/* Table */}
        <div className="bg-white rounded-xl shadow-md border overflow-hidden">
          {loading ? (
            <div className="text-center py-8 text-gray-600">Loading...</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr className="text-gray-800 font-semibold">
                  <th className="py-3 px-6 text-left">Email</th>
                  <th className="py-3 px-6 text-left">Name</th>
                  <th className="py-3 px-6 text-left">Status</th>
                  <th className="py-3 px-6 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center py-8 text-gray-500 font-medium"
                    >
                      No subscribers found
                    </td>
                  </tr>
                ) : (
                  subscribers.map((sub) => (
                    <tr
                      key={sub._id}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-gray-800 font-medium">
                        {sub.email}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {sub.name || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            sub.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {sub.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex gap-2">
                        <button
                          onClick={() => toggleStatus(sub._id)}
                          className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                            sub.status === 'active'
                              ? 'bg-red-100 text-red-700 hover:bg-red-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {sub.status === 'active'
                            ? 'Unsubscribe'
                            : 'Reactivate'}
                        </button>
                        <button
                          onClick={() => deleteSubscriber(sub._id)}
                          className="px-3 py-1 text-xs font-semibold rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200 flex items-center gap-1"
                        >
                          <FaTrash /> Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6 text-gray-800 font-medium">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <p>
            Page {page} of {totalPages}
          </p>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, icon, color }) {
  return (
    <div className="bg-white rounded-xl shadow-md border p-6 flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-700 mb-1 font-medium">{label}</p>
        <p className="text-2xl font-bold text-[#081C3C]">{value}</p>
      </div>
      <div className={`text-3xl ${color}`}>{icon}</div>
    </div>
  );
}
