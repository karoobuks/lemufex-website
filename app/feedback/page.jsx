'use client';
import { useState } from 'react';

export default function FeedbackPage() {
  const [name, setName] = useState('');
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // API call will go here
    console.log({ name, rating, message });
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col">
      {/* Navbar placeholder */}
      {/* <nav className="bg-[#004d4d] text-white p-4">Navbar</nav> */}

      <main className="flex-grow flex justify-center items-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
          <h1 className="text-2xl font-bold text-[#004d4d] mb-4">Customer Feedback</h1>

          {submitted ? (
            <p className="text-green-600">Thank you for your feedback!</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-[#f5a623]"
                required
              />

              {/* Star rating */}
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`cursor-pointer text-2xl ${star <= rating ? 'text-[#f5a623]' : 'text-gray-300'}`}
                    onClick={() => setRating(star)}
                  >
                    ★
                  </span>
                ))}
              </div>

              <textarea
                placeholder="Your Feedback"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-[#f5a623]"
                rows="4"
                required
              />

              <button
                type="submit"
                className="bg-[#f5a623] text-white px-4 py-2 rounded hover:bg-[#e59400] transition-colors w-full"
              >
                Submit Feedback
              </button>
            </form>
          )}
        </div>
      </main>

      {/* Footer placeholder */}
      {/* <footer className="bg-[#004d4d] text-white p-4 text-center">Footer</footer> */}
    </div>
  );
}
