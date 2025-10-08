
'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Registering from './loaders/Registering';
import toSlug from '@/utils/toSlug';


const RegisterTrainingForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    emergencycontact:'',
    address: '',
    dob: '',
  });

  const [selectedTrainings, setSelectedTrainings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTrainingChange = (e) => {
    setSelectedTrainings(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);

    if (selectedTrainings.length === 0) {
      setError('Please select at least one training.');
      return;
    }

    const transformedTrainings = [
    { track: selectedTrainings, enrolledAt: new Date() }
  ];

    const payload = {
      ...formData,
      trainings: transformedTrainings,
    };

    setLoading(true);

    try {
      const res = await fetch('/api/register-training', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.error || 'Registration failed.');
        setError(data?.error || 'Registration failed.');
        return;
      }

      // toast.success('Registration successful');

      // const selectedCourse = data.user.trainings[0]?.track;

      // router.push(`/payment/confirm?courseName=${encodeURIComponent(selectedCourse)}&email=${encodeURIComponent(data.user.email)}&userId=${data.user._id}`);

      toast.success('Registration successful');

    if (data?.user) {
      const selectedCourse = data.user.trainings?.[0]?.track;

      const courseSlug = toSlug(selectedCourse)

      router.push(
        `/payment/confirm?slug=${encodeURIComponent(selectedCourse)}&email=${encodeURIComponent(data.user.email)}&userId=${data.user._id}`
      );
    } else {
      console.error("No user returned from API:", data);
      toast.error("Could not fetch registered user details.");
    }
    
    } catch (err) {
      toast.error('Registration failed. Try again.');
      setError('Registration failed. Please try again');
      console.log('Registration failed. An error has occurred:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 py-12">
      <div className="bg-white max-w-lg w-full rounded-xl shadow-md p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center text-[#002D62]">
          Lemufex Training Registration
        </h2>
        <p className="text-sm text-center text-gray-500">
          Register for Automation, Electrical, or Software Programming training
        </p>
        {error && <p className="text-bold text-sm text-red-600">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              name="fullName"
              type="text"
              required
              className="mt-1 block w-full text-gray-900 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FE9900]"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              required
              className="mt-1 block w-full border text-gray-900 border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FE9900]"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              name="phone"
              type="tel"
              required
              className="mt-1 block w-full border text-gray-900 border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FE9900]"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Emergency Contact
            </label>
            <input
              name="emergencycontact"
              type="tel"
              required
              className="mt-1 block w-full border text-gray-900 border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FE9900]"
              value={formData.emergencycontact}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Trainee Address
            </label>
            <input
              name="address"
              type="text"
              required
              className="mt-1 block w-full border text-gray-900 border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FE9900]"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date of Birth
            </label>
            <input
              name="dob"
              type="date"
              required
              className="mt-1 block w-full border text-gray-900 border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FE9900]"
              value={formData.dob}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Trainings
            </label>
            <div className="space-y-2">
              {['Automation', 'Electrical Engineering', 'Software Programming'].map((training) => (
                <label key={training} className="flex items-center gap-2">
                  <input
                    type="radio"
                    value={training}
                    name="training"
                    checked={selectedTrainings === training}
                    onChange={handleTrainingChange}
                    className="accent-[#FE9900]"
                  />
                  <span className="text-gray-700">{training}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-[#FE9900] hover:bg-[#e88500] text-white font-semibold rounded-md transition"
          >
            {loading ? <Registering className="font-bold" /> : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterTrainingForm;
