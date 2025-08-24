'use client';
import React from 'react';

export default function DocumentsSection({ documents }) {
  return (
    <div className="bg-white shadow rounded-xl p-6 mb-6">
      <h2 className="text-xl font-semibold text-[#1E293B] mb-4">Documents & Certificates</h2>
      {documents.length === 0 ? (
        <p className='text-gray-700'>No documents uploaded yet.</p>
      ) : (
        <ul className="list-disc pl-6 space-y-2">
          {documents.map((doc, index) => (
            <li key={index}>
              <a href={doc.url} className="text-[#FE9900] hover:underline" download>
                {doc.name}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
