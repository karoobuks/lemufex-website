'use client';
import Image from 'next/image';

import React from 'react';

export default function ProfileHeader({ name, imageUrl }) {

  console.log('Image URL in ProfileHeader:', imageUrl);

  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="relative min-w-36 min-h-36 sm:min-w-48 sm:min-h-48 md:min-w-56 md:min-h-56 rounded-full overflow-hidden border-4 border-[#FE9900]">
      <Image
        src={imageUrl || '/default-avatar.png'}
        alt={name}
        // width={40}
        // height={40}
        fill
        unoptimized
        className='object-cover'
        // className="w-20 h-20 rounded-full border-4 border-[#FE9900]"
      />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-[#1E293B]">Welcome, {name}</h1>
        <p className="text-gray-600">This is your Lemufex Trainee Profile</p>
      </div>
    </div>
  );
}
