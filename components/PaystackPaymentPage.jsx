
"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaCreditCard, FaShieldAlt, FaSpinner, FaCheckCircle } from "react-icons/fa";
import toast from "react-hot-toast";
import toSlug from "@/utils/toSlug";
import LemLoader from "@/components/loaders/LemLoader";

export default function PaymentConfirmPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const rawSlug = searchParams.get("slug");
  const slug = toSlug(rawSlug);
  const email = searchParams.get("email");
  const userId = searchParams.get("userId");

  const [loading, setLoading] = useState(false);
  const [fetchingPrices, setFetchingPrices] = useState(true);
  const [paymentType, setPaymentType] = useState("full");
  const [prices, setPrices] = useState({ full: 0, installment: 0 });

  useEffect(() => {
    async function fetchPrices() {
      try {
        setFetchingPrices(true);
        const res = await fetch(`/api/courses/${slug}/prices`);
        const data = await res.json();
        setPrices({
          full: data.full,
          installment: data.installment,
        });
      } catch (err) {
        console.error("Error fetching prices:", err);
        toast.error("Failed to load course pricing");
      } finally {
        setFetchingPrices(false);
      }
    }
    if (slug) fetchPrices();
  }, [slug]);

  async function handlePayment() {
    try {
      setLoading(true);

      const res = await fetch("/api/payment/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          email,
          slug,
          paymentType,
        }),
      });

      const data = await res.json();

      if (data.authorizationUrl) {
        window.location.href = data.authorizationUrl;
      } else {
        toast.error(data.error || "Failed to initiate payment");
      }
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Error starting payment");
    } finally {
      setLoading(false);
    }
  }

  if (fetchingPrices) return <LemLoader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4F4F4] to-gray-200 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button 
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-[#002B5B] hover:text-[#FE9900] mb-4 transition-colors"
          >
            <FaArrowLeft /> Back
          </button>
          <h1 className="text-2xl font-bold text-[#002B5B] mb-2">
            <FaCreditCard className="inline mr-3 text-[#FE9900]" />
            Payment Confirmation
          </h1>
          <p className="text-gray-600">
            Complete your enrollment for this engineering program
          </p>
        </div>

        {/* Course Details */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-[#002B5B] mb-4">Course Details</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Program:</span>
              <span className="font-semibold text-[#002B5B]">{rawSlug}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium text-gray-800">{email}</span>
            </div>
          </div>
        </div>

        {/* Payment Options */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-[#002B5B] mb-4">
            Choose Payment Option
          </h2>
          <div className="space-y-4">
            <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-[#FE9900]/50 has-[:checked]:border-[#FE9900] has-[:checked]:bg-orange-50">
              <input
                type="radio"
                name="payment"
                value="full"
                checked={paymentType === "full"}
                onChange={() => setPaymentType("full")}
                className="mr-4 text-[#FE9900] focus:ring-[#FE9900]"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-[#002B5B]">Full Payment</span>
                    <p className="text-sm text-gray-600">Pay once and save more</p>
                  </div>
                  <span className="text-xl font-bold text-[#FE9900]">
                    ₦{prices.full?.toLocaleString() || "0"}
                  </span>
                </div>
              </div>
              {paymentType === "full" && (
                <FaCheckCircle className="text-[#FE9900] ml-2" />
              )}
            </label>

            <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-[#FE9900]/50 has-[:checked]:border-[#FE9900] has-[:checked]:bg-orange-50">
              <input
                type="radio"
                name="payment"
                value="installment"
                checked={paymentType === "installment"}
                onChange={() => setPaymentType("installment")}
                className="mr-4 text-[#FE9900] focus:ring-[#FE9900]"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-[#002B5B]">Installment Payment</span>
                    <p className="text-sm text-gray-600">Pay in parts, start learning immediately</p>
                  </div>
                  <span className="text-xl font-bold text-[#FE9900]">
                    ₦{prices.installment?.toLocaleString() || "0"}
                  </span>
                </div>
              </div>
              {paymentType === "installment" && (
                <FaCheckCircle className="text-[#FE9900] ml-2" />
              )}
            </label>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <FaShieldAlt className="text-blue-600" />
            <div>
              <h3 className="font-semibold text-blue-800">Secure Payment</h3>
              <p className="text-sm text-blue-600">
                Your payment is processed securely through Paystack. We never store your card details.
              </p>
            </div>
          </div>
        </div>

        {/* Payment Button */}
        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-[#FE9900] text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-[#e28500] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg"
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin" />
              Processing Payment...
            </>
          ) : (
            <>
              <FaCreditCard />
              Proceed to Pay ₦{(paymentType === "full" ? prices.full : prices.installment)?.toLocaleString() || "0"}
            </>
          )}
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          By proceeding, you agree to our terms and conditions
        </p>
      </div>
    </div>
  );
}
