'use client';
import React from 'react';
import Link from 'next/link';
import ChangePasswordButton from './ChangePasswordButton';

export default function AccountDetails({ details }) {


  return (
    <div className="bg-white shadow rounded-xl p-6 mb-6">
      <h2 className="text-xl font-semibold text-[#1E293B] mb-4">Account Details</h2>
      <ul className="text-gray-700 space-y-2">
        <li><strong>Username:</strong> {details.username}</li>
        <li><strong>Account Created:</strong> {details.createdAt}</li>
        <li><strong>Status:</strong> <span className="font-semibold text-green-600">{details.status}</span></li>
      </ul>
      {/* <pre className="bg-gray-900 p-2 rounded text-xs">
  {JSON.stringify(details, null, 2)}
</pre> */}
<div className='mt-4'>
 <ChangePasswordButton  hasPassword={details.hasPassword}/>
</div>
      
      {/* <button className="mt-4 bg-[#FE9900] text-white px-4 py-2 rounded hover:bg-orange-600">Change Password</button> */}
    </div>
  );
}
