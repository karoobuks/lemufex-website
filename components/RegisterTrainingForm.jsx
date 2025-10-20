
'use client';
import { useState, useCallback, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaGraduationCap, FaCreditCard, FaShieldAlt, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import Registering from './loaders/Registering';

const TRAINING_OPTIONS = [
  { id: 'automation', name: 'Automation', description: 'Industrial automation and control systems', duration: '6 months', icon: '🤖' },
  { id: 'electrical', name: 'Electrical Engineering', description: 'Power systems and electrical installations', duration: '8 months', icon: '⚡' },
  { id: 'software', name: 'Software Programming', description: 'Full-stack web development', duration: '6 months', icon: '💻' }
];

// const PAYMENT_PLANS = [
//   { id: 'full', name: 'Full Payment', description: 'Pay complete amount upfront', discount: '10% discount', icon: '💰' },
//   { id: 'installment', name: 'Installment Plan', description: 'Pay in monthly installments', benefit: 'Flexible payments', icon: '📅' }
// ];

const validateField = (name, value) => {
  switch (name) {
    case 'fullName': return value.length < 2 ? 'Name must be at least 2 characters' : '';
    case 'email': return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Invalid email format' : '';
    case 'phone': return !/^[\+]?[1-9][\d]{1,14}$/.test(value.replace(/\s/g, '')) ? 'Invalid phone number' : '';
    case 'emergencycontact': return !/^[\+]?[1-9][\d]{1,14}$/.test(value.replace(/\s/g, '')) ? 'Invalid emergency contact' : '';
    case 'address': return value.length < 10 ? 'Address must be at least 10 characters' : '';
    case 'dob': {
      const age = new Date().getFullYear() - new Date(value).getFullYear();
      return age < 16 || age > 65 ? 'Age must be between 16 and 65' : '';
    }
    default: return '';
  }
};

const RegisterTrainingForm = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: session?.user?.email || '',
    phone: '',
    emergencycontact: '',
    address: '',
    dob: ''
  });
  
  const [selectedTraining, setSelectedTraining] = useState('');
  // const [paymentPlan, setPaymentPlan] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [step, setStep] = useState(1);

  const fieldErrors = useMemo(() => {
    const errs = {};
    Object.keys(formData).forEach(key => {
      if (touched[key]) errs[key] = validateField(key, formData[key]);
    });
    return errs;
  }, [formData, touched]);

  const isStepValid = useMemo(() => {
    switch (step) {
      case 1: return formData.fullName && formData.email && !fieldErrors.fullName && !fieldErrors.email;
      case 2: return formData.phone && formData.emergencycontact && formData.address && formData.dob && 
                     !fieldErrors.phone && !fieldErrors.emergencycontact && !fieldErrors.address && !fieldErrors.dob;
      case 3: return selectedTraining //&& paymentPlan;
      default: return false;
    }
  }, [step, formData, fieldErrors, selectedTraining]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  }, [errors]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isStepValid) return;

    setLoading(true);
    setErrors({});

    try {
      const payload = {
        ...formData,
        trainings: [{ track: selectedTraining, enrolledAt: new Date(), totalModules: 0 }],
       
      };

      const res = await fetch('/api/register-training', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          toast.error('Too many registration attempts. Please try again later.');
        } else {
          toast.error(data?.error || 'Registration failed');
        }
        setErrors({ submit: data?.error || 'Registration failed' });
        return;
      }

      toast.success('🎉 Registration successful!');
      
      if (data?.trainee) {
        const course = data.trainee.trainings?.[0]?.track;
        router.push(`/payment/confirm?slug=${encodeURIComponent(course)}&email=${encodeURIComponent(data.trainee.email)}&userId=${data.trainee._id}`);
      } else {
        router.push('/trainee-registration-success');
      }
    } catch (err) {
      console.error('Registration error:', err);
      toast.error('Network error. Please try again.');
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#FE9900] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-white max-w-md w-full rounded-xl shadow-lg p-8 text-center">
          <FaShieldAlt className="text-4xl text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please log in to register for training programs.</p>
          <button 
            onClick={() => router.push('/login')}
            className="w-full bg-[#FE9900] hover:bg-[#e88500] text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
        <p className="text-sm text-gray-600">Let's start with your basic details</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FaUser className="inline mr-2" />Full Name *
          </label>
          <input
            name="fullName"
            type="text"
            required
            placeholder="Enter your full name"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition text-gray-900 ${
              fieldErrors.fullName ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-[#FE9900]'
            }`}
            value={formData.fullName}
            onChange={handleChange}
          />
          {fieldErrors.fullName && <p className="text-red-500 text-xs mt-1">{fieldErrors.fullName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FaEnvelope className="inline mr-2" />Email Address *
          </label>
          <input
            name="email"
            type="email"
            required
            placeholder="Enter your email address"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition text-gray-900 ${
              fieldErrors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-[#FE9900]'
            }`}
            value={formData.email}
            onChange={handleChange}
          />
          {fieldErrors.email && <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-lg font-semibold text-gray-900">Contact & Address</h3>
        <p className="text-sm text-gray-600">We need these details for program coordination</p>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaPhone className="inline mr-2" />Phone Number *
            </label>
            <input
              name="phone"
              type="tel"
              required
              placeholder="+1234567890"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition text-gray-900 ${
                fieldErrors.phone ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-[#FE9900]'
              }`}
              value={formData.phone}
              onChange={handleChange}
            />
            {fieldErrors.phone && <p className="text-red-500 text-xs mt-1">{fieldErrors.phone}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaPhone className="inline mr-2" />Emergency Contact *
            </label>
            <input
              name="emergencycontact"
              type="tel"
              required
              placeholder="+1234567890"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition text-gray-900 ${
                fieldErrors.emergencycontact ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-[#FE9900]'
              }`}
              value={formData.emergencycontact}
              onChange={handleChange}
            />
            {fieldErrors.emergencycontact && <p className="text-red-500 text-xs mt-1">{fieldErrors.emergencycontact}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FaMapMarkerAlt className="inline mr-2" />Address *
          </label>
          <textarea
            name="address"
            required
            rows={3}
            placeholder="Enter your complete address"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition resize-none text-gray-900 ${
              fieldErrors.address ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-[#FE9900]'
            }`}
            value={formData.address}
            onChange={handleChange}
          />
          {fieldErrors.address && <p className="text-red-500 text-xs mt-1">{fieldErrors.address}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FaCalendarAlt className="inline mr-2" />Date of Birth *
          </label>
          <input
            name="dob"
            type="date"
            required
            max={new Date(new Date().setFullYear(new Date().getFullYear() - 16)).toISOString().split('T')[0]}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition text-gray-900 ${
              fieldErrors.dob ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-[#FE9900]'
            }`}
            value={formData.dob}
            onChange={handleChange}
          />
          {fieldErrors.dob && <p className="text-red-500 text-xs mt-1">{fieldErrors.dob}</p>}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-lg font-semibold text-gray-900">Training & Payment</h3>
        <p className="text-sm text-gray-600">Choose your program and payment option</p>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            <FaGraduationCap className="inline mr-2" />Select Training Program *
          </label>
          <div className="space-y-3">
            {TRAINING_OPTIONS.map((training) => (
              <label key={training.id} className={`block p-4 border-2 rounded-lg cursor-pointer transition ${
                selectedTraining === training.name ? 'border-[#FE9900] bg-orange-50' : 'border-gray-200 hover:border-gray-300'
              }`}>
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    value={training.name}
                    checked={selectedTraining === training.name}
                    onChange={(e) => setSelectedTraining(e.target.value)}
                    className="mt-1 accent-[#FE9900]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{training.icon}</span>
                      <span className="font-semibold text-gray-900">{training.name}</span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">{training.duration}</span>
                    </div>
                    <p className="text-sm text-gray-600">{training.description}</p>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          {/* <label className="block text-sm font-medium text-gray-700 mb-4">
            <FaCreditCard className="inline mr-2" />Payment Plan *
          </label> */}
          {/* <div className="space-y-3">
            {PAYMENT_PLANS.map((plan) => (
              <label key={plan.id} className={`block p-4 border-2 rounded-lg cursor-pointer transition ${
                paymentPlan === plan.id ? 'border-[#FE9900] bg-orange-50' : 'border-gray-200 hover:border-gray-300'
              }`}>
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    value={plan.id}
                    checked={paymentPlan === plan.id}
                    onChange={(e) => setPaymentPlan(e.target.value)}
                    className="mt-1 accent-[#FE9900]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{plan.icon}</span>
                      <span className="font-semibold text-gray-900">{plan.name}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        plan.id === 'full' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {plan.id === 'full' ? plan.discount : plan.benefit}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{plan.description}</p>
                  </div>
                </div>
              </label>
            ))}
          </div> */}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#002D62] to-[#0D274D] text-white p-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Lemufex Training Registration</h1>
            <p className="text-blue-100">Join our world-class technical training programs</p>
          </div>

          {/* Progress Bar */}
          <div className="px-8 py-4 bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`flex items-center ${
                  i < 3 ? 'flex-1' : ''
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step >= i ? 'bg-[#FE9900] text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {step > i ? <FaCheckCircle /> : i}
                  </div>
                  {i < 3 && (
                    <div className={`flex-1 h-1 mx-4 ${
                      step > i ? 'bg-[#FE9900]' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-600">
              <span>Personal Info</span>
              <span>Contact Details</span>
              <span>Training & Payment</span>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-8">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}

            {errors.submit && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                <FaExclamationTriangle className="text-red-500" />
                <span className="text-red-700">{errors.submit}</span>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={() => setStep(s => Math.max(1, s - 1))}
                disabled={step === 1}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Previous
              </button>
              
              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => setStep(s => s + 1)}
                  disabled={!isStepValid}
                  className="px-6 py-2 bg-[#FE9900] hover:bg-[#e88500] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading || !isStepValid}
                  className="px-8 py-2 bg-[#FE9900] hover:bg-[#e88500] text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
                >
                  {loading ? <Registering /> : (
                    <>
                      <FaCheckCircle />
                      Complete Registration
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterTrainingForm;
