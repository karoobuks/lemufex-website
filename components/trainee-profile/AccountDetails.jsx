'use client';
import { FaUser, FaCalendarAlt, FaCheckCircle, FaShieldAlt } from 'react-icons/fa';
import ChangePasswordButton from './ChangePasswordButton';

export default function AccountDetails({ details }) {
  const accountItems = [
    { icon: FaUser, label: 'Username', value: details.username || 'Not set' },
    { icon: FaCalendarAlt, label: 'Member Since', value: details.createdAt || 'Unknown' },
    { 
      icon: FaCheckCircle, 
      label: 'Account Status', 
      value: details.status || 'Active',
      isStatus: true 
    },
  ]

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-8 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <FaShieldAlt className="text-[#FE9900] text-2xl" />
        <h2 className="text-xl sm:text-2xl font-bold text-[#002B5B]">Account Details</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {accountItems.map((item, index) => (
          <div key={index} className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-[#F8F9FC] rounded-xl">
            <div className="bg-[#FE9900]/10 p-2 sm:p-3 rounded-lg flex-shrink-0">
              <item.icon className="text-[#FE9900] text-base sm:text-lg" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-semibold text-[#002B5B] mb-1">{item.label}</p>
              {item.isStatus ? (
                <div className="flex items-center">
                  <span className="inline-flex items-center px-2 sm:px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs sm:text-sm font-bold border border-green-200 max-w-full">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full mr-1.5 sm:mr-2 flex-shrink-0"></div>
                    <span className="truncate">{item.value}</span>
                  </span>
                </div>
              ) : (
                <p className="text-[#444] font-medium text-sm sm:text-base truncate">{item.value}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Security Section */}
      <div className="border-t border-[#A0AEC0]/20 pt-6">
        <h3 className="text-lg font-semibold text-[#002B5B] mb-4">Security Settings</h3>
        <div className="bg-[#081C3C]/5 border border-[#081C3C]/10 rounded-xl p-3 sm:p-4 mb-4">
          <div className="flex items-start gap-2 sm:gap-3">
            <FaShieldAlt className="text-[#002B5B] mt-0.5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <h4 className="font-medium text-[#002B5B] text-sm sm:text-base">Password Protection</h4>
              <p className="text-xs sm:text-sm text-[#555]">
                {details.hasPassword 
                  ? "Your account is secured with a password" 
                  : "Set up a password to secure your account"
                }
              </p>
            </div>
          </div>
        </div>
        <ChangePasswordButton hasPassword={details.hasPassword} />
      </div>
    </div>
  );
}