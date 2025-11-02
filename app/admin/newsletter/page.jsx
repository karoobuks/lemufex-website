

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
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-[#FE9900] rounded-lg">
            <FaEnvelope className="text-white" size={20} />
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#081C3C]">Newsletter Management</h1>
        </div>
        <p className="text-sm sm:text-base text-gray-700">
          Manage your newsletter subscribers and track engagement
        </p>
      </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
              <input
                type="text"
                placeholder="Search subscribers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FE9900] focus:border-[#FE9900]"
              />
            </div>
            <button
              onClick={exportSubscribers}
              className="bg-[#FE9900] hover:bg-[#E68900] text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-lg flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <FaDownload size={14} /> 
              <span className="hidden sm:inline">Export CSV</span>
              <span className="sm:hidden">Export</span>
            </button>
          </div>
        </div>

        {/* Send Newsletter */}
          <div className="bg-white rounded-xl text-gray-700 shadow-sm border border-gray-200 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-[#081C3C] mb-4 flex items-center gap-2">
              <FaEnvelope className="text-[#FE9900]" size={18} /> Send Newsletter
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
              className="space-y-3 sm:space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  name="subject"
                  placeholder="Enter newsletter subject"
                  className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 text-sm sm:text-base focus:ring-2 focus:ring-[#FE9900] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  name="message"
                  rows="4"
                  placeholder="Write your newsletter content here..."
                  className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 text-sm sm:text-base focus:ring-2 focus:ring-[#FE9900] focus:border-transparent resize-none"
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-[#FE9900] hover:bg-[#F8C400] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg flex items-center justify-center gap-2 font-semibold text-sm sm:text-base w-full sm:w-auto"
              >
                <FaEnvelope size={14} /> 
                <span className="hidden sm:inline">Send Newsletter</span>
                <span className="sm:hidden">Send</span>
              </button>
            </form>
          </div>


        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">Subscribers List</h3>
          </div>
          
          {loading ? (
            <div className="text-center py-8 text-gray-600">Loading...</div>
          ) : (
            <>
            {/* Mobile Card View */}
            <div className="block sm:hidden">
              {subscribers.length === 0 ? (
                <div className="text-center py-8 text-gray-500 font-medium">
                  No subscribers found
                </div>
              ) : (
                subscribers.map((sub) => (
                  <div key={sub._id} className="p-4 border-b border-gray-200 last:border-b-0">
                    <div className="flex items-center justify-between mb-3">
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-gray-800 text-sm truncate">{sub.email}</div>
                        <div className="text-xs text-gray-500">{sub.name || '-'}</div>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${
                          sub.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {sub.status}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleStatus(sub._id)}
                        className={`px-2 py-1 text-xs font-semibold rounded-lg transition flex-1 ${
                          sub.status === 'active'
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {sub.status === 'active' ? 'Unsubscribe' : 'Reactivate'}
                      </button>
                      <button
                        onClick={() => deleteSubscriber(sub._id)}
                        className="px-2 py-1 text-xs font-semibold rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200 flex items-center gap-1"
                      >
                        <FaTrash size={10} /> Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr className="text-gray-800 font-semibold">
                    <th className="py-3 px-4 lg:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="py-3 px-4 lg:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="py-3 px-4 lg:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="py-3 px-4 lg:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
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
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 lg:px-6 py-4 text-sm text-gray-800 font-medium">
                          {sub.email}
                        </td>
                        <td className="px-4 lg:px-6 py-4 text-sm text-gray-700">
                          {sub.name || '-'}
                        </td>
                        <td className="px-4 lg:px-6 py-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              sub.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {sub.status}
                          </span>
                        </td>
                        <td className="px-4 lg:px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => toggleStatus(sub._id)}
                              className={`px-2 sm:px-3 py-1 text-xs font-semibold rounded-lg transition ${
                                sub.status === 'active'
                                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                  : 'bg-green-100 text-green-700 hover:bg-green-200'
                              }`}
                            >
                              <span className="hidden lg:inline">
                                {sub.status === 'active' ? 'Unsubscribe' : 'Reactivate'}
                              </span>
                              <span className="lg:hidden">
                                {sub.status === 'active' ? 'Unsub' : 'React'}
                              </span>
                            </button>
                            <button
                              onClick={() => deleteSubscriber(sub._id)}
                              className="px-2 sm:px-3 py-1 text-xs font-semibold rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200 flex items-center gap-1"
                            >
                              <FaTrash size={10} /> 
                              <span className="hidden lg:inline">Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            </>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-gray-800 font-medium">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 sm:px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50 text-sm sm:text-base w-full sm:w-auto"
              >
                Previous
              </button>
              <p className="text-sm sm:text-base">
                Page {page} of {totalPages}
              </p>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 sm:px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50 text-sm sm:text-base w-full sm:w-auto"
              >
                Next
              </button>
            </div>
          </div>
        )}
    </div>
  );
}

function Stat({ label, value, icon, color }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 flex items-center justify-between">
      <div>
        <p className="text-xs sm:text-sm text-gray-700 mb-1 font-medium">{label}</p>
        <p className="text-lg sm:text-2xl font-bold text-[#081C3C]">{value}</p>
      </div>
      <div className={`text-2xl sm:text-3xl ${color}`}>{icon}</div>
    </div>
  );
}
