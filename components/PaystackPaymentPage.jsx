
"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaUniversity, FaShieldAlt, FaCheckCircle } from "react-icons/fa";
import toast from "react-hot-toast";
import toSlug from "@/utils/toSlug";
import LemLoader from "@/components/loaders/LemLoader";
import PaymentFlow from "@/components/PaymentFlow";

export default function PaymentConfirmPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const rawSlug = searchParams.get("slug");
  const slug = toSlug(rawSlug);
  const email = searchParams.get("email");
  const userId = searchParams.get("userId");

  const [fetchingPrices, setFetchingPrices] = useState(true);
  const [paymentType, setPaymentType] = useState("full");
  const [prices, setPrices] = useState({ full: 0, installment: 0 });
  const [showPayment, setShowPayment] = useState(false);
  const [courseId, setCourseId] = useState(null);

  useEffect(() => {
    async function fetchPrices() {
      try {
        setFetchingPrices(true);
        const res = await fetch(`/api/courses/${slug}/prices`);
        const data = await res.json();
        setPrices({ full: data.full, installment: data.installment });
        setCourseId(data.courseId);
      } catch (err) {
        console.error("Error fetching prices:", err);
        toast.error("Failed to load course pricing");
      } finally {
        setFetchingPrices(false);
      }
    }
    if (slug) fetchPrices();
  }, [slug]);

  const handlePaymentSuccess = (data) => {
    router.push(`/payment/success?reference=${data.reference}`);
  };

  if (fetchingPrices) return <LemLoader />;

  if (showPayment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F4F4F4] to-gray-200 py-8 px-4">
        <div className="max-w-2xl mx-auto mb-6">
          <button
            onClick={() => setShowPayment(false)}
            className="inline-flex items-center gap-2 text-[#081C3C] hover:text-[#FE9900] transition-colors"
          >
            <FaArrowLeft /> Back to Options
          </button>
        </div>
        <PaymentFlow
          course={{ title: rawSlug, slug: slug }}
          session={{ user: { id: userId, email: email } }}
          paymentType={paymentType}
          amount={paymentType === "full" ? prices.full : prices.installment}
          courseId={courseId}
          onSuccess={handlePaymentSuccess}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4F4F4] to-gray-200 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-[#081C3C] hover:text-[#FE9900] mb-4 transition-colors"
          >
            <FaArrowLeft /> Back
          </button>
          <h1 className="text-2xl font-bold text-[#081C3C] mb-2">
            <FaUniversity className="inline mr-3 text-[#FE9900]" />
            Payment Confirmation
          </h1>
          <p className="text-gray-600">Complete your enrollment for this engineering program</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-[#081C3C] mb-4">Course Details</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Program:</span>
              <span className="font-semibold text-[#081C3C]">{rawSlug}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium text-gray-800">{email}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-[#081C3C] mb-4">Choose Payment Option</h2>
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
                    <span className="font-semibold text-[#081C3C]">Full Payment</span>
                    <p className="text-sm text-gray-600">Pay once and save more</p>
                  </div>
                  <span className="text-xl font-bold text-[#FE9900]">
                    ₦{prices.full?.toLocaleString() || "0"}
                  </span>
                </div>
              </div>
              {paymentType === "full" && <FaCheckCircle className="text-[#FE9900] ml-2" />}
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
                    <span className="font-semibold text-[#081C3C]">Installment Payment</span>
                    <p className="text-sm text-gray-600">Pay in parts, start learning immediately</p>
                  </div>
                  <span className="text-xl font-bold text-[#FE9900]">
                    ₦{prices.installment?.toLocaleString() || "0"}
                  </span>
                </div>
              </div>
              {paymentType === "installment" && <FaCheckCircle className="text-[#FE9900] ml-2" />}
            </label>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <FaShieldAlt className="text-[#081C3C]" />
            <div>
              <h3 className="font-semibold text-[#081C3C]">Secure Payment</h3>
              <p className="text-sm text-gray-600">
               Pay securely with Paystack or transfer to our UBA account. Bank transfers are verified within 24 hours.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowPayment(true)}
          className="w-full bg-[#FE9900] text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-[#F8C400] transition-colors flex items-center justify-center gap-3 shadow-lg"
        >
          <FaCheckCircle />
          Proceed to Payment - ₦{(paymentType === "full" ? prices.full : prices.installment)?.toLocaleString() || "0"}
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          By proceeding, you agree to our terms and conditions
        </p>
      </div>
    </div>
  );
}
