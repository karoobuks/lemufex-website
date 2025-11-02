'use client';
import { useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { FaUser, FaCamera, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function ProfileHeader({ name, imageUrl, onImageUpdate }) {
  const [uploading, setUploading] = useState(false);
  const [currentImage, setCurrentImage] = useState(imageUrl);
  const fileInputRef = useRef(null);
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      
      const formData = new FormData();
      formData.append('image', file);
      

      const response = await fetch(`/api/upload-profile-image/${userId}`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setCurrentImage(data.imageUrl);
        onImageUpdate?.(data.imageUrl);
        toast.success('Profile picture updated successfully!');
      } else {
        toast.error(data.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 border border-gray-100">
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        {/* Profile Image */}
        <div className="relative flex-shrink-0">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-[#FE9900] shadow-lg">
            {currentImage ? (
              <Image
                src={currentImage}
                alt={name}
                width={128}
                height={128}
                className="w-full h-full object-cover"
                unoptimized
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#FE9900] to-[#F8C400] flex items-center justify-center">
                <FaUser className="text-white text-2xl sm:text-4xl" />
              </div>
            )}
          </div>
          
          {/* Camera Icon */}
          <button
            onClick={handleCameraClick}
            disabled={uploading}
            className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 bg-[#FE9900] rounded-full p-1.5 sm:p-2 shadow-lg hover:bg-[#F8C400] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Change profile picture"
          >
            {uploading ? (
              <FaSpinner className="text-white text-xs sm:text-sm animate-spin" />
            ) : (
              <FaCamera className="text-white text-xs sm:text-sm" />
            )}
          </button>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        {/* Profile Info */}
        <div className="text-center sm:text-left flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#002B5B] mb-2 truncate">
            {name || 'Welcome'}
          </h1>
          <p className="text-[#555] text-sm sm:text-base lg:text-lg mb-3 sm:mb-1">
            Lemufex Engineering Trainee
          </p>
          <div className="inline-flex items-center px-2 sm:px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs sm:text-sm font-bold border border-green-200">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full mr-1.5 sm:mr-2 flex-shrink-0"></div>
            <span className="truncate">Active Member</span>
          </div>
        </div>
      </div>
    </div>
  );
}