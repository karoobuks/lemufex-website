'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function PersonalInfo({ info }) {

  const {data:session, status} = useSession()
  const userId = session?.user?.id
  const router = useRouter()
  return (
    <div className="bg-white shadow rounded-xl p-6 mb-6">
      <h2 className="text-xl font-semibold text-[#1E293B] mb-4">Personal Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
        <div><strong>Full Name:</strong> {info.name}</div>
        <div><strong>Email:</strong> {info.email}</div>
        <div><strong>Phone:</strong> {info.phone}</div>
        <div><strong>Address:</strong> {info.address}</div>
        <div><strong>Date of Birth:</strong> {info.dob}</div>
        <div><strong>Emergency Contact:</strong> {info.emergencyContact}</div>
      </div>
       <button onClick={() => router.push(`/edit/${userId}/edit-profile`)} className="mt-4 bg-[#FE9900] text-white px-4 py-2 rounded hover:bg-orange-600">Edit Profile</button>
    </div>
  );
}
