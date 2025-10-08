
"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toSlug from "@/utils/toSlug";

export default function PaymentConfirmPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const rawSlug = searchParams.get("slug"); //  from query
  const slug = toSlug(rawSlug)
  const email = searchParams.get("email");
  const userId = searchParams.get("userId"); // ✅ make sure you pass this from registration/login


  const [loading, setLoading] = useState(false);
  const [paymentType, setPaymentType] = useState("full"); // default full
  const [prices, setPrices] = useState({ full: 0, installment: 0 });

  // Fetch course prices from backend
  useEffect(() => {
    async function fetchPrices() {
      try {
        const res = await fetch(`/api/courses/${slug}/prices`);
        const data = await res.json();
        setPrices({
          full: data.full,
          installment: data.installment,
        });
      } catch (err) {
        console.error("Error fetching prices:", err);
      }
    }
    if (slug) fetchPrices();
  }, [slug]);

  console.log("slugs appear:", slug)

  // ✅ Initiate payment with backend
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
          paymentType, // "full" or "installment"
        }),
      });

      const data = await res.json();

      if (data.authorizationUrl) {
        window.location.href = data.authorizationUrl; // redirect to Paystack
      } else {
        console.error("Payment initiation failed:", data);
        alert(data.error || "Failed to initiate payment");
      }
    } catch (err) {
      console.error("Payment error:", err);
      alert("Error starting payment");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold text-center text-[#016A70] mb-4">
        Confirm Payment
      </h1>
      <p className="text-lg font-medium text-gray-900">
        Course: {rawSlug}
      </p>
      <p className="text-gray-800 font-medium text-lg">Email: {email}</p>

      {/* Payment Option Selection */}
      <div className="mt-6">
        <h2 className="font-semibold text-[#002B5B] mb-2">
          Choose Payment Option
        </h2>
        <div className="space-y-3">
          <label className="flex items-center text-[#002B5B] border p-3 rounded-lg cursor-pointer hover:shadow-md">
            <input
              type="radio"
              name="payment"
              value="full"
              checked={paymentType === "full"}
              onChange={() => setPaymentType("full")}
              className="mr-2"
            />
            <span className="flex-1">
              <span className="font-bold">Full Payment:</span> ₦
              {(prices.full || 0 ).toLocaleString()}
            </span>
          </label>

          <label className="flex items-center text-[#002B5B] border p-3 rounded-lg cursor-pointer hover:shadow-md">
            <input
              type="radio"
              name="payment"
              value="installment"
              checked={paymentType === "installment"}
              onChange={() => setPaymentType("installment")}
              className="mr-2"
            />
            <span className="flex-1">
              <span className="font-bold">Installment:</span> ₦
              {(prices.installment || 0 ).toLocaleString()}
            </span>
          </label>
        </div>
      </div>

      {/* Proceed Button */}
      <button
        onClick={handlePayment}
        disabled={loading}
        className="mt-6 w-full py-3 bg-[#FFD93D] text-[#016A70] font-bold rounded-lg hover:bg-[#016A70] hover:text-white transition"
      >
        {loading ? "Processing..." : "Proceed to Pay"}
      </button>
    </div>
  );
}
