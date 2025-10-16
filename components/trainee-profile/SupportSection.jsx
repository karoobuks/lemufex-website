'use client';
import Link from 'next/link';
import { FaHeadset, FaQuestionCircle, FaEnvelope, FaPhone, FaComments } from 'react-icons/fa';
import { useLiveChat } from '@/components/GlobalLiveChat';

export default function SupportSection() {
  const { showChat } = useLiveChat();
  
  const supportOptions = [
    {
      icon: FaEnvelope,
      title: 'Email Support',
      description: 'Get help via email within 24 hours',
      action: 'Contact Support',
      href: '/contact',
      color: 'bg-[#002B5B] hover:bg-[#081C3C]'
    },
    {
      icon: FaQuestionCircle,
      title: 'FAQ Center',
      description: 'Find answers to common questions',
      action: 'Browse FAQs',
      href: '/faq',
      color: 'bg-[#00F49C] hover:bg-[#00F49C]/80 text-[#002B5B]'
    },
    {
      icon: FaComments,
      title: 'Live Chat',
      description: 'Chat with our support team',
      action: 'Start Chat',
      isChat: true,
      color: 'bg-[#FE9900] hover:bg-[#F8C400]'
    }
  ]

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <FaHeadset className="text-[#FE9900] text-2xl" />
        <h2 className="text-2xl font-bold text-[#002B5B]">Need Help?</h2>
      </div>

      <p className="text-[#555] mb-8">
        Our support team is here to help you succeed in your engineering journey. 
        Choose the best way to get in touch with us.
      </p>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {supportOptions.map((option, index) => (
          <div key={index} className="text-center p-6 bg-[#F8F9FC] rounded-xl hover:bg-[#F8F9FC]/80 transition-colors">
            <div className="bg-white p-4 rounded-full w-16 h-16 mx-auto mb-4 shadow-sm">
              <option.icon className="text-[#FE9900] text-2xl mx-auto mt-1" />
            </div>
            <h3 className="font-semibold text-[#444] mb-2">{option.title}</h3>
            <p className="text-sm text-[#555] mb-4">{option.description}</p>
            {option.isChat ? (
              <button
                onClick={showChat}
                className={`inline-block text-white px-4 py-2 rounded-lg transition-colors font-medium ${option.color}`}
              >
                {option.action}
              </button>
            ) : (
              <Link
                href={option.href}
                className={`inline-block text-white px-4 py-2 rounded-lg transition-colors font-medium ${option.color}`}
              >
                {option.action}
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Quick Contact Info */}
      <div className="bg-gradient-to-r from-[#081C3C] to-[#0D274D] rounded-xl p-6 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div>
            <h3 className="font-semibold mb-2">Quick Contact</h3>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <FaPhone className="text-[#F8C400]" />
                <span>+234 800 000 0000</span>
              </div>
              <div className="flex items-center gap-2">
                <FaEnvelope className="text-[#F8C400]" />
                <span>support@lemufex.com</span>
              </div>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <p className="text-sm text-[#A0AEC0]">Available Mon-Fri, 9AM-6PM WAT</p>
          </div>
        </div>
      </div>
    </div>
  );
}