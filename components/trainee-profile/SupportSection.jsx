'use client';
import React from 'react';

export default function SupportSection() {
  return (
    <div className="bg-white shadow rounded-xl p-6 mb-6">
      <h2 className="text-xl font-semibold text-[#1E293B] mb-4">Need Help?</h2>
      <p className="mb-4 text-gray-700">Contact our support team for assistance or view FAQs.</p>
      <div className="flex gap-4 flex-wrap">
        <a href="/contact" className="bg-[#FE9900] text-white px-4 py-2 rounded hover:bg-orange-600">Contact Support</a>
        <a href="/faq" className="bg-gray-200 text-[#1E293B] px-4 py-2 rounded hover:bg-gray-300">View FAQs</a>
      </div>
    </div>
  );
}
