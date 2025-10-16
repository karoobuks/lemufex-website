"use client";
import Image from "next/image";
import { FaCog, FaHardHat, FaBolt } from 'react-icons/fa';

export default function LemLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#1E2A38] to-[#2A3B4A]">
      <div className="text-center">
        {/* Main Logo with Orbital Animation */}
        <div className="relative mb-6">
          <div className="relative w-20 h-20 mx-auto">
            <Image
              src="/favicon-lemufex.ico" 
              alt="Lemufex Engineering"
              width={80}
              height={80}
              className="rounded-full shadow-2xl animate-pulse"
            />
            {/* Orbital Ring */}
            <div className="absolute inset-0 border-2 border-[#FE9900] rounded-full animate-spin opacity-60"></div>
            <div className="absolute -inset-2 border border-[#FE9900] rounded-full animate-ping opacity-30"></div>
          </div>
        </div>

        {/* Brand Name */}
        <h2 className="text-xl font-bold text-white mb-2">
          <span className="text-[#FE9900]">Lemufex</span> Engineering
        </h2>

        {/* Engineering Icons */}
        <div className="flex justify-center gap-4 mb-4">
          <FaHardHat className="text-[#FE9900] animate-bounce" style={{animationDelay: '0s'}} />
          <FaCog className="text-[#FE9900] animate-spin" />
          <FaBolt className="text-[#FE9900] animate-bounce" style={{animationDelay: '0.3s'}} />
        </div>

        {/* Loading Dots */}
        <div className="flex justify-center gap-1">
          <div className="w-2 h-2 bg-[#FE9900] rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
          <div className="w-2 h-2 bg-[#FE9900] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          <div className="w-2 h-2 bg-[#FE9900] rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
        </div>
      </div>
    </div>
  );
}