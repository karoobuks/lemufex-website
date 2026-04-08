'use client';
import { useState, useEffect, useCallback } from 'react';
import { FaEnvelope, FaTrash, FaReply, FaTimes, FaSync, FaImage, FaPhone } from 'react-icons/fa';
import toast from 'react-hot-toast';

const STATUS_STYLES = {
  pending:  'bg-yellow-100 text-yellow-700',
  replied:  'bg-green-100 text-green-700',
  closed:   'bg-gray-100 text-gray-600',
};

export default function AdminQuotesPage() {
  const [quotes, setQuotes]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [filter, setFilter]           = useState('all');
  const [selected, setSelected]       = useState(null); // quote being replied to
  const [replyMsg, setReplyMsg]       = useState('');
  const [sending, setSending]         = useState(false);
  const [deleting, setDeleting]       = useState(null);

  const fetchQuotes = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch('/api/admin/quotes');
      const data = await res.json();
      if (res.ok) setQuotes(data.quotes || []);
      else toast.error(data.error || 'Failed to load quotes');
    } catch { toast.error('Failed to load quotes'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchQuotes(); }, [fetchQuotes]);

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyMsg.trim()) return;
    setSending(true);
    try {
      const res  = await fetch('/api/admin/quotes/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quoteId: selected._id, replyMessage: replyMsg }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Reply sent successfully!');
        setQuotes(prev => prev.map(q => q._id === selected._id ? { ...q, status: 'replied', adminReply: replyMsg } : q));
        setSelected(null);
        setReplyMsg('');
      } else {
        toast.error(data.error || 'Failed to send reply');
      }
    } catch { toast.error('Failed to send reply'); }
    finally { setSending(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Permanently delete this quote request?')) return;
    setDeleting(id);
    try {
      const res  = await fetch(`/api/admin/quotes?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        toast.success('Quote deleted');
        setQuotes(prev => prev.filter(q => q._id !== id));
        if (selected?._id === id) setSelected(null);
      } else toast.error(data.error || 'Failed to delete');
    } catch { toast.error('Failed to delete'); }
    finally { setDeleting(null); }
  };

  const filtered = quotes.filter(q => filter === 'all' || q.status === filter);
  const counts   = {
    all:     quotes.length,
    pending: quotes.filter(q => q.status === 'pending').length,
    replied: quotes.filter(q => q.status === 'replied').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#081C3C]">Quote Requests</h1>
            <p className="text-gray-500 text-sm mt-1">View and reply to client quote requests</p>
          </div>
          <button onClick={fetchQuotes} className="flex items-center gap-2 bg-[#081C3C] hover:bg-[#0a2347] text-white px-4 py-2 rounded-lg text-sm transition-colors">
            <FaSync size={12} /> Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          {[
            { label: 'Total',   value: counts.all,     color: 'text-[#081C3C]', bg: 'bg-gray-50'   },
            { label: 'Pending', value: counts.pending,  color: 'text-yellow-600', bg: 'bg-yellow-50' },
            { label: 'Replied', value: counts.replied,  color: 'text-green-600',  bg: 'bg-green-50'  },
          ].map(s => (
            <div key={s.label} className={`${s.bg} rounded-lg p-4 text-center`}>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Tabs + List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
          {['all', 'pending', 'replied'].map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-6 py-3 text-sm font-medium capitalize transition-colors ${
                filter === tab ? 'border-b-2 border-[#FE9900] text-[#FE9900]' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab} ({counts[tab] ?? quotes.length})
            </button>
          ))}
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-[#FE9900] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Loading quote requests...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <FaEnvelope className="mx-auto mb-3 text-gray-300" size={40} />
            <p>No {filter !== 'all' ? filter : ''} quote requests found.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map(quote => (
              <div key={quote._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-3">
                      <div className="w-10 h-10 rounded-full bg-[#081C3C] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {quote.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="font-semibold text-[#081C3C]">{quote.name}</p>
                        <p className="text-xs text-gray-500">{quote.email}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[quote.status] || STATUS_STYLES.pending}`}>
                        {quote.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                      <div className="bg-gray-50 rounded-lg px-3 py-2">
                        <p className="text-xs text-gray-400 font-medium uppercase mb-0.5">Service</p>
                        <p className="text-sm text-[#081C3C] font-semibold">{quote.service}</p>
                      </div>
                      {quote.options && (
                        <div className="bg-gray-50 rounded-lg px-3 py-2">
                          <p className="text-xs text-gray-400 font-medium uppercase mb-0.5">Specific Need</p>
                          <p className="text-sm text-gray-700">{quote.options}</p>
                        </div>
                      )}
                      {quote.phone && (
                        <div className="bg-gray-50 rounded-lg px-3 py-2 flex items-center gap-2">
                          <FaPhone size={11} className="text-gray-400" />
                          <p className="text-sm text-gray-700">{quote.phone}</p>
                        </div>
                      )}
                      <div className="bg-gray-50 rounded-lg px-3 py-2">
                        <p className="text-xs text-gray-400 font-medium uppercase mb-0.5">Submitted</p>
                        <p className="text-sm text-gray-700">
                          {new Date(quote.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>

                    <div className="bg-[#FFF7ED] border-l-4 border-[#FE9900] rounded px-3 py-2 mb-3">
                      <p className="text-xs text-gray-400 font-medium uppercase mb-1">Message</p>
                      <p className="text-sm text-gray-700">{quote.message}</p>
                    </div>

                    {quote.image && (
                      <a href={quote.image} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs text-[#FE9900] hover:underline mb-3">
                        <FaImage size={11} /> View Attached Image
                      </a>
                    )}

                    {quote.adminReply && (
                      <div className="bg-green-50 border-l-4 border-green-500 rounded px-3 py-2">
                        <p className="text-xs text-green-600 font-medium uppercase mb-1">Your Reply</p>
                        <p className="text-sm text-gray-700">{quote.adminReply}</p>
                        {quote.repliedAt && (
                          <p className="text-xs text-gray-400 mt-1">
                            Sent {new Date(quote.repliedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <button
                      onClick={() => { setSelected(quote); setReplyMsg(quote.adminReply || ''); }}
                      className="flex items-center gap-1.5 bg-[#FE9900] hover:bg-[#F8C400] text-white px-3 py-2 rounded-lg text-xs font-semibold transition-colors"
                    >
                      <FaReply size={11} /> {quote.adminReply ? 'Edit Reply' : 'Reply'}
                    </button>
                    <button
                      onClick={() => handleDelete(quote._id)}
                      disabled={deleting === quote._id}
                      className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                    >
                      {deleting === quote._id
                        ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        : <FaTrash size={11} />}
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reply Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-bold text-[#081C3C]">Reply to Quote Request</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Sending to <span className="font-medium text-[#081C3C]">{selected.name}</span> — {selected.email}
                </p>
              </div>
              <button onClick={() => { setSelected(null); setReplyMsg(''); }} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <FaTimes className="text-gray-500" />
              </button>
            </div>

            {/* Original request summary */}
            <div className="px-6 pt-4">
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <p className="text-xs text-gray-400 font-medium uppercase mb-1">Regarding</p>
                <p className="text-sm font-semibold text-[#081C3C]">{selected.service}{selected.options ? ` — ${selected.options}` : ''}</p>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{selected.message}</p>
              </div>
            </div>

            <form onSubmit={handleReply} className="px-6 pb-6">
              <label className="block text-sm font-semibold text-[#081C3C] mb-2">Your Reply</label>
              <textarea
                value={replyMsg}
                onChange={e => setReplyMsg(e.target.value)}
                rows={6}
                required
                placeholder="Type your personalised response to this client..."
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FE9900] focus:border-transparent resize-none text-gray-800"
              />
              <p className="text-xs text-gray-400 mt-1">This message will be sent directly to the client's email address.</p>

              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => { setSelected(null); setReplyMsg(''); }}
                  className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sending || !replyMsg.trim()}
                  className="flex-1 bg-[#FE9900] hover:bg-[#F8C400] text-white py-2.5 rounded-lg font-semibold text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {sending
                    ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Sending...</>
                    : <><FaEnvelope size={13} /> Send Reply</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
