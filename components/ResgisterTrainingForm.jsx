'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const RegisterTrainingForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    trainings: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false)
  const router = useRouter()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTrainingChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      trainings: checked
        ? [...prev.trainings, value]
        : prev.trainings.filter((t) => t !== value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate registration
      // await new Promise((res) => setTimeout(res, 1000));
      // toast.success('Registration successful!');
      // setFormData({ name: '', email: '', phone: '', address:'', trainings: [] });

      const res = await fetch('/api/register-training', {
        method:'POST',
        headers:{"Content-Type": "application/json"},
        body: JSON.stringify(formData)
      })
      const data = res.json()

      if(res.ok){
        toast.success('Registration successful')
        router.push('/trainee-registration-success')
      }
    } catch (err) {
      toast.error('Registration failed. Try again.');
      setError('Registration failed',err)
      console.log('Registration failed. An error has occured:', err)
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
            {error &&(<p className='text-bold text-sm text-red-600'>{error}</p>)}
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Trainings
            </label>
            <div className="space-y-2">
              {['Automation', 'Electrical', 'Software Programming'].map((training) => (
                <label key={training} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value={training}
                    checked={formData.trainings.includes(training)}
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
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterTrainingForm;
