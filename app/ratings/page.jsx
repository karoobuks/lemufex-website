'use client';
import { useState } from 'react';

export default function RatingsPage() {
  const [sortOrder, setSortOrder] = useState('latest');

  // Example ratings (replace with API data)
  const ratings = [
    { id: 1, name: 'John Doe', rating: 5, feedback: 'Excellent service!', date: '2025-08-01' },
    { id: 2, name: 'Jane Smith', rating: 4, feedback: 'Very good but room for improvement.', date: '2025-07-25' },
  ];

  const sortedRatings = [...ratings].sort((a, b) => {
    if (sortOrder === 'latest') return new Date(b.date) - new Date(a.date);
    if (sortOrder === 'highest') return b.rating - a.rating;
    return a.rating - b.rating;
  });

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col">
      {/* Navbar placeholder */}
      {/* <nav className="bg-[#004d4d] text-white p-4">Navbar</nav> */}

      <main className="flex-grow p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-[#004d4d]">Customer Ratings</h1>

            {/* Sort dropdown */}
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#f5a623]"
            >
              <option value="latest">Latest</option>
              <option value="highest">Highest Rated</option>
              <option value="lowest">Lowest Rated</option>
            </select>
          </div>

          {/* Ratings list */}
          <div className="space-y-4">
            {sortedRatings.map((item) => (
              <div key={item.id} className="border p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-lg">{item.name}</h2>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`text-xl ${star <= item.rating ? 'text-[#f5a623]' : 'text-gray-300'}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mt-2">{item.feedback}</p>
                <p className="text-sm text-gray-500 mt-1">Posted on {item.date}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer placeholder */}
      {/* <footer className="bg-[#004d4d] text-white p-4 text-center">Footer</footer> */}
    </div>
  );
}
