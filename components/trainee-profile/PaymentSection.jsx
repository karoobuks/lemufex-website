'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { FaCreditCard, FaCheckCircle, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function PaymentSection() {
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    fetchPaymentStatus();
  }, []);

  const fetchPaymentStatus = async () => {
    try {
      const response = await fetch('/api/payment/status');
      
      if (response.ok) {
        const data = await response.json();
        setPaymentStatus(data);
      } else {
        setPaymentStatus(null);
      }
    } catch (error) {
      console.error('Error fetching payment status:', error);
      setPaymentStatus(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCompletePayment = async () => {
    if (!paymentStatus?.pendingAmount) return;

    setProcessing(true);
    try {
      const response = await fetch('/api/payment/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: paymentStatus.pendingAmount,
          courseId: paymentStatus.courseId
        })
      });

      const data = await response.json();
      
      if (response.ok && data.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        toast.error(data.error || 'Failed to initiate payment');
      }
    } catch (error) {
      toast.error('Payment initiation failed');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-center py-8">
          <FaSpinner className="animate-spin text-[#FE9900] text-2xl" />
        </div>
      </div>
    );
  }

  if (paymentStatus === null) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-4">
          <FaCreditCard className="text-[#FE9900] text-xl" />
          <h3 className="text-lg font-semibold text-[#081C3C]">Payment Status</h3>
        </div>
        <p className="text-gray-600">No payment information available</p>
      </div>
    );
  }

  const { totalAmount, paidAmount, pendingAmount, paymentType, isCompleted, track } = paymentStatus;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-6">
        <FaCreditCard className="text-[#FE9900] text-xl" />
        <h3 className="text-lg font-semibold text-[#081C3C]">Payment Status</h3>
      </div>

      <div className="space-y-4">
        {/* Payment Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#F8F9FC] rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Total Course Fee</p>
            <p className="text-lg font-semibold text-[#081C3C]">₦{totalAmount?.toLocaleString()}</p>
          </div>
          <div className="bg-[#F8F9FC] rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Amount Paid</p>
            <p className="text-lg font-semibold text-green-600">₦{paidAmount?.toLocaleString()}</p>
          </div>
          <div className="bg-[#F8F9FC] rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">{pendingAmount > 0 ? 'Amount Due' : 'Balance'}</p>
            <p className={`text-lg font-semibold ${pendingAmount > 0 ? 'text-[#FE9900]' : 'text-green-600'}`}>
              ₦{pendingAmount?.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Payment Progress Bar */}
        {paymentType === 'installment' && (
          <div className="bg-[#F8F9FC] rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Payment Progress</span>
              <span className="text-sm font-medium text-[#081C3C]">
                {Math.round((paidAmount / totalAmount) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-[#FE9900] to-[#F8C400] h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((paidAmount / totalAmount) * 100, 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>₦0</span>
              <span>₦{totalAmount?.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Payment Type */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Payment Type:</span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            paymentType === 'full' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-blue-100 text-blue-800'
          }`}>
            {paymentType === 'full' ? 'Full Payment' : 'Installment Payment'}
          </span>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2">
          {isCompleted ? (
            <>
              <FaCheckCircle className="text-green-500" />
              <span className="text-green-600 font-medium">Payment Completed</span>
            </>
          ) : (
            <>
              <FaExclamationTriangle className="text-[#FE9900]" />
              <span className="text-[#FE9900] font-medium">Payment Pending</span>
            </>
          )}
        </div>

        {/* Complete Payment Button */}
        {!isCompleted && pendingAmount > 0 && (
          <div className="pt-4 border-t border-gray-100">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <FaExclamationTriangle className="text-blue-600" />
                <span className="font-medium text-blue-800">Payment Required</span>
              </div>
              <p className="text-sm text-blue-700">
                You have an outstanding balance of <strong>₦{pendingAmount?.toLocaleString()}</strong> to complete your course enrollment.
              </p>
            </div>
            <button
              onClick={handleCompletePayment}
              disabled={processing}
              className="w-full bg-[#FE9900] hover:bg-[#F8C400] text-white py-3 px-6 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {processing ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <FaCreditCard />
                  Pay Remaining Balance (₦{pendingAmount?.toLocaleString()})
                </>
              )}
            </button>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Secure payment powered by Paystack
            </p>
          </div>
        )}
      </div>
    </div>
  );
}