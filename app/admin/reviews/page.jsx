'use client';
import { useState, useEffect, useCallback } from 'react';
import { FaStar, FaCheck, FaTimes, FaTrash, FaSync } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [filter, setFilter] = useState('all');

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/reviews');
      const data = await res.json();
      if (res.ok) {
        setReviews(data.reviews || []);
      } else {
        toast.error(data.error || 'Failed to fetch reviews');
      }
    } catch (error) {
      toast.error('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const handleApprove = async (reviewId, approve) => {
    setActionLoading(reviewId + (approve ? '_approve' : '_reject'));
    try {
      const res = await fetch('/api/admin/reviews', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId, isApproved: approve }),
      });
      const data = await res.json();
      if (res.ok) {
        setReviews(prev =>
          prev.map(r => r._id === reviewId ? { ...r, isApproved: approve } : r)
        );
        toast.success(approve ? 'Review approved!' : 'Review rejected');
      } else {
        toast.error(data.error || 'Failed to update review');
      }
    } catch (error) {
      toast.error('Failed to update review');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!confirm('Are you sure you want to permanently delete this review?')) return;
    setActionLoading(reviewId + '_delete');
    try {
      const res = await fetch(`/api/admin/reviews?id=${reviewId}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        setReviews(prev => prev.filter(r => r._id !== reviewId));
        toast.success('Review deleted');
      } else {
        toast.error(data.error || 'Failed to delete review');
      }
    } catch (error) {
      toast.error('Failed to delete review');
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = reviews.filter(r => {
    if (filter === 'pending') return !r.isApproved;
    if (filter === 'approved') return r.isApproved;
    return true;
  });

  const pendingCount = reviews.filter(r => !r.isApproved).length;
  const approvedCount = reviews.filter(r => r.isApproved).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#081C3C]">Manage Reviews</h1>
            <p className="text-gray-500 text-sm mt-1">Approve or delete client reviews</p>
          </div>
          <button
            onClick={fetchReviews}
            className="flex items-center gap-2 bg-[#081C3C] hover:bg-[#0a2347] text-white px-4 py-2 rounded-lg transition-colors text-sm"
          >
            <FaSync size={12} /> Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-[#081C3C]">{reviews.length}</p>
            <p className="text-xs text-gray-500 mt-1">Total Reviews</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
            <p className="text-xs text-gray-500 mt-1">Pending</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
            <p className="text-xs text-gray-500 mt-1">Approved</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
          {[
            { key: 'all', label: `All (${reviews.length})` },
            { key: 'pending', label: `Pending (${pendingCount})` },
            { key: 'approved', label: `Approved (${approvedCount})` },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                filter === tab.key
                  ? 'border-b-2 border-[#FE9900] text-[#FE9900]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Reviews List */}
        <div className="divide-y divide-gray-100">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-4 border-[#FE9900] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Loading reviews...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <p>No {filter !== 'all' ? filter : ''} reviews found.</p>
            </div>
          ) : (
            filtered.map(review => (
              <div key={review._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  {/* Left: Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-[#081C3C] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {review.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="font-semibold text-[#081C3C]">{review.name || 'Anonymous'}</p>
                        <p className="text-xs text-gray-500">{review.email}</p>
                      </div>
                      {/* Status badge */}
                      <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${
                        review.isApproved
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {review.isApproved ? 'Approved' : 'Pending'}
                      </span>
                    </div>

                    {/* Stars */}
                    <div className="flex gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          size={14}
                          className={i < review.rating ? 'text-[#FE9900]' : 'text-gray-300'}
                        />
                      ))}
                    </div>

                    {/* Comment */}
                    <p className="text-gray-700 text-sm">"{review.comment}"</p>

                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-gray-400 capitalize bg-gray-100 px-2 py-0.5 rounded">
                        {review.serviceType}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(review.createdAt).toLocaleDateString('en-GB', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Approve button — show for pending reviews */}
                    {!review.isApproved && (
                      <button
                        onClick={() => handleApprove(review._id, true)}
                        disabled={actionLoading === review._id + '_approve'}
                        title="Approve"
                        className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                      >
                        {actionLoading === review._id + '_approve' ? (
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <FaCheck size={11} />
                        )}
                        Approve
                      </button>
                    )}

                    {/* Reject/Unapprove button — show for approved reviews */}
                    {review.isApproved && (
                      <button
                        onClick={() => handleApprove(review._id, false)}
                        disabled={actionLoading === review._id + '_reject'}
                        title="Unapprove"
                        className="flex items-center gap-1.5 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                      >
                        {actionLoading === review._id + '_reject' ? (
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <FaTimes size={11} />
                        )}
                        Unapprove
                      </button>
                    )}

                    {/* Delete — always visible */}
                    <button
                      onClick={() => handleDelete(review._id)}
                      disabled={actionLoading === review._id + '_delete'}
                      title="Delete permanently"
                      className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                    >
                      {actionLoading === review._id + '_delete' ? (
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <FaTrash size={11} />
                      )}
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
