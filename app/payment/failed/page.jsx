"use client";
import Link from "next/link";
import { XCircle } from "lucide-react";

export default function PaymentFailedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-center px-4">
      <XCircle className="text-red-600 w-20 h-20 mb-4" />
      <h1 className="text-2xl font-bold text-red-700">Payment Failed ❌</h1>
      <p className="text-gray-600 mt-2">
        Oops! Something went wrong with your payment. Please try again.
      </p>

      <div className="mt-6 flex gap-4">
        <Link
          href="/dashboard"
          className="px-6 py-3 bg-gray-600 text-white rounded-lg shadow hover:bg-gray-700"
        >
          Back to Dashboard
        </Link>
        <Link
          href="/checkout"
          className="px-6 py-3 bg-red-600 text-white rounded-lg shadow hover:bg-red-700"
        >
          Try Again
        </Link>
      </div>
    </div>
  );
}
