'use client'

import { FaCog, FaHardHat, FaBolt, FaTools, FaCode } from 'react-icons/fa'

const LoadingPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#1E2A38] via-[#2A3B4A] to-[#1E2A38]">
      <div className="text-center">
        {/* Main Logo/Brand */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            <span className="text-[#FE9900]">Lemufex</span> Engineering
          </h1>
          <p className="text-gray-300 text-sm">Building Excellence Through Innovation</p>
        </div>

        {/* Animated Engineering Icons */}
        <div className="flex justify-center items-center gap-6 mb-8">
          <FaHardHat className="text-2xl text-[#FE9900] animate-bounce" style={{animationDelay: '0s'}} />
          <FaBolt className="text-2xl text-[#FE9900] animate-bounce" style={{animationDelay: '0.2s'}} />
          <FaCog className="text-3xl text-[#FE9900] animate-spin" />
          <FaTools className="text-2xl text-[#FE9900] animate-bounce" style={{animationDelay: '0.4s'}} />
          <FaCode className="text-2xl text-[#FE9900] animate-bounce" style={{animationDelay: '0.6s'}} />
        </div>

        {/* Loading Bar */}
        <div className="w-64 mx-auto mb-6">
          <div className="h-1 bg-gray-600 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#FE9900] to-orange-400 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Loading Text */}
        <p className="text-gray-400 text-sm animate-pulse">
          Preparing your engineering solutions...
        </p>
      </div>
    </div>
  )
}

export default LoadingPage