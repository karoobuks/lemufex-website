'use client';
import { useState, useEffect } from 'react';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

export default function Testimonials() {
  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [serviceType, setServiceType] = useState('training');
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/reviews');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      console.log('Reviews data received:', data); // Debug log
      if (data.reviews) {
        console.log('Setting reviews:', data.reviews); // Debug log
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session) {
      toast.error('Please login to submit a review');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment, serviceType })
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('Review submitted! It will appear after admin approval.');
        setShowForm(false);
        setComment('');
        setRating(5);
      } else {
        toast.error(data.error || 'Failed to submit review');
      }
    } catch (error) {
      toast.error('Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gradient-to-b from-white to-gray-50 py-20 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#081C3C] mb-4">Client Reviews</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">See what our clients say about their experience with Lemufex Engineering</p>
        </div>

        {session && (
          <div className="text-center mb-8">
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-[#FE9900] hover:bg-[#F8C400] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              {showForm ? 'Cancel' : 'Write a Review'}
            </button>
          </div>
        )}

        {showForm && (
          <div className="max-w-2xl mx-auto mb-12 bg-white rounded-xl shadow-lg p-6 border-2 border-[#FE9900]">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-[#081C3C] font-semibold mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="text-3xl transition-colors"
                    >
                      <FaStar className={star <= rating ? 'text-[#FE9900]' : 'text-gray-300'} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-[#081C3C] font-semibold mb-2">Service Type</label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE9900]"
                >
                  <option value="training">Training</option>
                  <option value="quote">Quote/Service</option>
                  <option value="service">General Service</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-[#081C3C] font-semibold mb-2">Your Review</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience with us..."
                  maxLength={500}
                  rows={4}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE9900] resize-none"
                />
                <p className="text-sm text-gray-500 mt-1">{comment.length}/500 characters</p>
              </div>

              <button
                type="submit"
                disabled={loading || !comment.trim()}
                className="w-full bg-[#081C3C] hover:bg-[#0a2347] text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        )}

        <div className="grid gap-8 md:grid-cols-3">
          {reviews.length === 0 ? (
            <div className="col-span-3 text-center py-12 text-gray-500">
              <p>No reviews yet. Be the first to share your experience!</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div
                key={review._id}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow border-t-4 border-[#FE9900]"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={i < review.rating ? 'text-[#FE9900]' : 'text-gray-300'}
                        size={18}
                      />
                    ))}
                  </div>
                  <FaQuoteLeft className="text-[#FE9900] opacity-20" size={24} />
                </div>
                <p className="text-gray-700 mb-4 italic">"{review.comment}"</p>
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-[#081C3C]">{review.name}</h4>
                  <p className="text-xs text-gray-500 capitalize">{review.serviceType} Client</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
