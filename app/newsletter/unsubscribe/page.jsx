'use client';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function UnsubscribePage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [message, setMessage] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUnsubscribe = async () => {
    if (!token) {
      setMessage('Invalid unsubscribe link.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/newsletter/unsubscribe?token=${token}`);
      const data = await res.json();
      setMessage(data.message);
      setConfirmed(true);
    } catch (err) {
      console.error(err);
      setMessage('Something went wrong, please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setConfirmed(true);
    setMessage('You remain subscribed to our newsletter.');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white p-6 rounded-xl shadow text-center max-w-md w-full">
        <h1 className="text-2xl font-bold text-[#081C3C] mb-3">Newsletter Update</h1>

        {!confirmed ? (
          <>
            <p className="text-gray-700 mb-4">
              Are you sure you want to unsubscribe from our newsletter?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleUnsubscribe}
                disabled={loading}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Yes, Unsubscribe'}
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-600">{message}</p>
        )}
      </div>
    </div>
  );
}
