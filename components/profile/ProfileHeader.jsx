//'use client';

//import Image from 'next/image';
import Trainee from "@/models/Trainee";
import User from "@/models/User";


export default async function ProfileHeader({ trainee }) {
      const trainee = await Trainee.findOne()
  return (
    <div className="flex items-center gap-4 p-6 border-b">
      <img
        src={ '/placeholder-avatar.png'}
        alt={`${trainee.name} profile`}
        width={80}
        height={80}
        className="rounded-full bg-amber-50"
      />
      <div>
        <h1 className="text-2xl font-bold text-[#1E1E1E]">{trainee.name}</h1>
        <p className="text-[#FE9900] font-medium">{trainee.track}</p>
        <span className={`inline-block px-3 py-1 rounded-full text-sm text-white bg-green-500 mt-1`}>
          {trainee.status || 'Active'}
        </span>
      </div>
    </div>
  );
}
