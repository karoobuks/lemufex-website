'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import toast from 'react-hot-toast';

export default function AdminReviewsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(null);

    const fetchReviews = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/reviews');
            const data = await res.json();
            if (res.ok) {
                setReviews(data.reviews);
            } else {
                toast.error(data.error || 'Failed to fetch reviews.');
            }
        } catch (error) {
            toast.error('An error occurred while fetching reviews.');
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (status === 'loading') {
            return; // Wait for session to be loaded
        }

        if (status === 'unauthenticated') {
            router.push('/login');
            return;
        }

        if (session.user?.role === 'admin') {
            fetchReviews();
        } else {
            router.push('/');
        }
    }, [status, session, router, fetchReviews]);

    const updateStatus = async (reviewId, newStatus) => {
        setActionLoading(reviewId);
        try {
            const res = await fetch('/api/admin/reviews', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reviewId, status: newStatus }),
            });
            const data = await res.json();
            if (res.ok) {
                setReviews((prev) =>
                    prev.map((review) =>
                        review._id === reviewId ? { ...review, status: newStatus } : review
                    )
                );
                toast.success(`Review status updated to ${newStatus}.`);
            } else {
                toast.error(data.error || 'Failed to update status.');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('An error occurred while updating status.');
        } finally {
            setActionLoading(null);
        }
    };

    const deleteReview = async (reviewId) => {
        if (!confirm('Are you sure you want to delete this review?')) return;

        setActionLoading(reviewId);
        try {
            const res = await fetch(`/api/admin/reviews?id=${reviewId}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (res.ok) {
                setReviews((prev) => prev.filter((review) => review._id !== reviewId));
                toast.success('Review deleted successfully.');
            } else {
                toast.error(data.error || 'Failed to delete review.');
            }
        } catch (error) {
            console.error('Error deleting review:', error);
            toast.error('An error occurred while deleting review.');
        } finally {
            setActionLoading(null);
        }
    };

    if (status === 'loading' || (loading && reviews.length === 0)) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (status !== 'authenticated' || session.user.role !== 'admin') {
        // useEffect handles redirection. This prevents rendering anything for non-admins.
        return null;
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Manage Reviews</h1>
                    <button
                        onClick={fetchReviews}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Refresh
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Rating</th>
                                    <th className="px-6 py-4">Review</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {reviews.map((review) => (
                                    <tr key={review._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0">
                                                    {review.user?.image ? (
                                                        <Image
                                                            src={review.user.image}
                                                            alt={review.user.name}
                                                            width={40}
                                                            height={40}
                                                            className="rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                                            {review.user?.firstName?.charAt(0) || 'U'}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {review.user ? `${review.user.firstName} ${review.user.lastName}` : (review.name || 'Anonymous')}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {review.user?.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-yellow-400">
                                                {[...Array(5)].map((_, i) => (
                                                    <svg
                                                        key={i}
                                                        className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'
                                                            }`}
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-600 line-clamp-2 max-w-xs">
                                                {review.comment}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${review.status === 'approved'
                                                    ? 'bg-green-100 text-green-800'
                                                    : review.status === 'rejected'
                                                        ? 'bg-red-100 text-red-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                    }`}
                                            >
                                                {review.status || 'pending'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-2">
                                                {review.status !== 'approved' && (
                                                    <button
                                                        onClick={() => updateStatus(review._id, 'approved')}
                                                        disabled={actionLoading === review._id}
                                                        className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 p-2 rounded-full transition-colors disabled:opacity-50"
                                                        title="Approve"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                )}
                                                {review.status !== 'rejected' && (
                                                    <button
                                                        onClick={() => updateStatus(review._id, 'rejected')}
                                                        disabled={actionLoading === review._id}
                                                        className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 p-2 rounded-full transition-colors disabled:opacity-50"
                                                        title="Reject"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => deleteReview(review._id)}
                                                    disabled={actionLoading === review._id}
                                                    className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors disabled:opacity-50"
                                                    title="Delete"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {reviews.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                                            No reviews found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}