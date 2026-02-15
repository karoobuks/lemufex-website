'use client';
import { useState, useEffect } from 'react';
import { FaStar, FaCheck, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/admin/reviews');
      const data = await res.json();
      if (res.ok) setReviews(data.reviews);
    } catch (error) {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (reviewId, approve) => {
    try {
      const res = await fetch('/api/reviews/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId, approve })
      });

      if (res.ok) {
        toast.success(approve ? 'Review approved!' : 'Review rejected');
        fetchReviews();
      } else {
        toast.error('Failed to update review');
      }
    } catch (error) {
      toast.error('Failed to update review');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><div className="text-[#081C3C]">Loading...</div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-[#081C3C] mb-6">Review Management</h1>
        
        {reviews.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No pending reviews</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-[#081C3C]">{review.name}</h3>
                    <p className="text-sm text-gray-500">{review.email}</p>
                    <div className="flex gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={i < review.rating ? 'text-[#FE9900]' : 'text-gray-300'} size={14} />
                      ))}
                    </div>
                  </div>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded capitalize">{review.serviceType}</span>
                </div>
                
                <p className="text-gray-700 mb-4">"{review.comment}"</p>
                
                <div className="flex gap-2">
                  {!review.isApproved && (
                    <>
                      <button
                        onClick={() => handleApprove(review._id, true)}
                        className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        <FaCheck /> Approve
                      </button>
                      <button
                        onClick={() => handleApprove(review._id, false)}
                        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        <FaTimes /> Reject
                      </button>
                    </>
                  )}
                  {review.isApproved && (
                    <span className="text-green-600 font-semibold">✓ Approved</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
