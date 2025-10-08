"use client";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function PaymentSuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 text-center px-4">
      <CheckCircle className="text-green-600 w-20 h-20 mb-4" />
      <h1 className="text-2xl font-bold text-green-700">Payment Successful 🎉</h1>
      <p className="text-gray-600 mt-2">
        Thank you! Your payment has been confirmed.
      </p>

      <div className="mt-6">
        <Link
          href="/dashboard"
          className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
