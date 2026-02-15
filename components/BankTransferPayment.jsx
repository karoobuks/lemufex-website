'use client';
import { useState } from 'react';
import { FaUniversity, FaCopy, FaCheckCircle, FaUpload } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function BankTransferPayment({ amount, courseId, userId, onSuccess }) {
  const [proofFile, setProofFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState(false);

  const bankDetails = {
    bankName: 'United Bank for Africa (UBA)',
    accountNumber: '2308979864',
    accountName: 'Obukevwo Emmanuel'
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }
    setProofFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!proofFile) {
      toast.error('Please upload payment proof');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', proofFile);
      formData.append('upload_preset', 'lemufex-payments');

      const cloudinaryRes = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      );
      const cloudinaryData = await cloudinaryRes.json();

      const paymentRes = await fetch('/api/payment/bank-transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          courseId,
          userId,
          proofUrl: cloudinaryData.secure_url
        })
      });

      const data = await paymentRes.json();
      if (paymentRes.ok) {
        toast.success('Payment proof submitted! Awaiting verification.');
        onSuccess?.(data);
      } else {
        toast.error(data.error || 'Failed to submit payment');
      }
    } catch (error) {
      toast.error('Failed to upload payment proof');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FE9900] rounded-full mb-4">
          <FaUniversity className="text-white text-2xl" />
        </div>
        <h2 className="text-2xl font-bold text-[#081C3C] mb-2">Bank Transfer Payment</h2>
        <p className="text-gray-600">Transfer ₦{amount?.toLocaleString()} to the account below</p>
      </div>

      <div className="bg-gradient-to-br from-[#081C3C] to-[#0a2347] rounded-xl p-6 mb-6 text-white">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-300 mb-1">Bank Name</p>
            <p className="text-lg font-semibold">{bankDetails.bankName}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-300 mb-1">Account Number</p>
            <div className="flex items-center justify-between bg-white/10 rounded-lg p-3">
              <p className="text-2xl font-bold tracking-wider">{bankDetails.accountNumber}</p>
              <button
                onClick={() => copyToClipboard(bankDetails.accountNumber)}
                className="ml-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                {copied ? <FaCheckCircle className="text-green-400" /> : <FaCopy />}
              </button>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-300 mb-1">Account Name</p>
            <p className="text-lg font-semibold">{bankDetails.accountName}</p>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border-l-4 border-[#FE9900] p-4 mb-6">
        <p className="text-sm text-gray-700">
          <strong>Important:</strong> After making the transfer, upload your payment receipt or screenshot below for verification.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-[#081C3C] font-semibold mb-3">
            Upload Payment Proof <span className="text-red-500">*</span>
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#FE9900] transition-colors">
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileChange}
              className="hidden"
              id="proof-upload"
              required
            />
            <label htmlFor="proof-upload" className="cursor-pointer">
              <FaUpload className="text-4xl text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-1">
                {proofFile ? proofFile.name : 'Click to upload payment proof'}
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, PDF (Max 5MB)</p>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={uploading || !proofFile}
          className="w-full bg-[#FE9900] hover:bg-[#F8C400] text-white py-4 rounded-lg font-bold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? 'Uploading...' : 'Submit Payment Proof'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-4">
        Your payment will be verified within 24 hours
      </p>
    </div>
  );
}
