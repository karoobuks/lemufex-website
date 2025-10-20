'use client';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FaEdit, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaUserFriends } from 'react-icons/fa';

export default function PersonalInfo({ info }) {
  const { data: session } = useSession()
  const userId = session?.user?.id
  const router = useRouter()

  const infoItems = [
    { icon: FaUser, label: 'Full Name', value: info.name || 'Not provided' },
    { icon: FaEnvelope, label: 'Email', value: info.email || 'Not provided' },
    { icon: FaPhone, label: 'Phone', value: info.phone || 'Not provided' },
    { icon: FaMapMarkerAlt, label: 'Address', value: info.address || 'Not provided' },
    { icon: FaCalendarAlt, label: 'Date of Birth', value: info.dob || 'Not provided' },
    { icon: FaUserFriends, label: 'Emergency Contact', value: info.emergencyContact || 'Not provided' },
  ]

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-8 border border-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-[#002B5B]">Personal Information</h2>
        <button 
          onClick={() => router.push(`/edit/${userId}/edit-profile`)} 
          className="inline-flex items-center justify-center gap-2 bg-[#FE9900] text-white px-4 py-2 rounded-lg hover:bg-[#F8C400] transition-colors font-medium text-sm sm:text-base"
        >
          <FaEdit className="text-sm" />
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {infoItems.map((item, index) => (
          <div key={index} className="flex items-start gap-4 p-4 bg-[#F8F9FC] rounded-xl">
            <div className="bg-[#FE9900]/10 p-3 rounded-lg">
              <item.icon className="text-[#FE9900] text-lg" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-[#002B5B] mb-1">{item.label}</p>
              <p className="text-[#444] font-medium">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}