'use client';
import { useState, useEffect } from 'react';
import { FaEnvelope, FaUsers, FaUserCheck, FaUserTimes, FaDownload, FaSearch } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, unsubscribed: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const response = await fetch('/api/newsletter');
      const data = await response.json();
      
      if (response.ok) {
        setSubscribers(data.subscribers);
        setStats(data.stats);
      } else {
        toast.error('Failed to load subscribers');
      }
    } catch (error) {
      toast.error('Error loading newsletter data');
    } finally {
      setLoading(false);
    }
  };

  const exportSubscribers = () => {
    const csvContent = [
      ['Email', 'Name', 'Status', 'Subscribed Date'],
      ...subscribers.map(sub => [
        sub.email,
        sub.name || '',
        sub.status,
        new Date(sub.subscribedAt).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredSubscribers = subscribers.filter(sub =>
    sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (sub.name && sub.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#FE9900] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading newsletter data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#F8F9FC] min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#081C3C] mb-2 flex items-center gap-3">
            <FaEnvelope className="text-[#FE9900]" />
            Newsletter Management
          </h1>
          <p className="text-gray-600">Manage your newsletter subscribers and track engagement</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Subscribers</p>
                <p className="text-2xl font-bold text-[#081C3C]">{stats.total}</p>
              </div>
              <FaUsers className="text-3xl text-[#081C3C]" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Subscribers</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <FaUserCheck className="text-3xl text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Unsubscribed</p>
                <p className="text-2xl font-bold text-red-600">{stats.unsubscribed}</p>
              </div>
              <FaUserTimes className="text-3xl text-red-600" />
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search subscribers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE9900] focus:border-transparent placeholder:text-gray-700 placeholder:font-semibold"
              />
            </div>
            <button
              onClick={exportSubscribers}
              className="bg-[#FE9900] hover:bg-[#F8C400] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <FaDownload />
              Export CSV
            </button>
          </div>
        </div>

        {/* Subscribers Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-[#081C3C]">Email</th>
                  <th className="text-left py-4 px-6 font-semibold text-[#081C3C]">Name</th>
                  <th className="text-left py-4 px-6 font-semibold text-[#081C3C]">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-[#081C3C]">Subscribed Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubscribers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-gray-500">
                      {searchTerm ? 'No subscribers found matching your search' : 'No subscribers yet'}
                    </td>
                  </tr>
                ) : (
                  filteredSubscribers.map((subscriber) => (
                    <tr key={subscriber._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-[#FE9900] rounded-full flex items-center justify-center">
                            <FaEnvelope className="text-white text-sm" />
                          </div>
                          <span className="font-medium text-[#081C3C]">{subscriber.email}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-700">
                        {subscriber.name || '-'}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          subscriber.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {subscriber.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-700">
                        {new Date(subscriber.subscribedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}