//components/PaymentFlow.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaCreditCard, FaUniversity, FaSpinner, FaCheckCircle } from "react-icons/fa";
import { toast } from "react-hot-toast";
import BankTransferPayment from "@/components/BankTransferPayment";

export default function PaymentFlow({ course, session, paymentType, amount, courseId, onSuccess }) {
    const router = useRouter();
    const [paymentMethod, setPaymentMethod] = useState("paystack");
    const [isLoading, setIsLoading] = useState(false);
    const [showBankTransfer, setShowBankTransfer] = useState(false);

    const handleProceed = async () => {
        if (!session?.user) {
            toast.error("You must be logged in to make a payment.");
            router.push("/login");
            return;
        }

        if (paymentMethod === "bank_transfer") {
            setShowBankTransfer(true);
            return;
        }

        // Paystack Flow
        setIsLoading(true);
        toast.loading("Initializing Paystack...");

        try {
            const res = await fetch("/api/payment/initiate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: session.user.id,
                    email: session.user.email,
                    slug: course.slug,
                    paymentType,
                    paymentMethod: "paystack",
                }),
            });

            const data = await res.json();
            toast.dismiss();

            if (!res.ok) {
                throw new Error(data.error || "Something went wrong.");
            }

            if (data.authorizationUrl) {
                toast.success("Redirecting to Paystack...");
                window.location.href = data.authorizationUrl;
            } else {
                throw new Error("Invalid response from server");
            }
        } catch (error) {
            toast.dismiss();
            toast.error(error.message);
            setIsLoading(false);
        }
    };

    if (showBankTransfer) {
        return (
            <BankTransferPayment
                amount={amount}
                courseId={courseId}
                userId={session.user.id}
                onSuccess={onSuccess}
            />
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-[#081C3C] mb-4">Select Payment Method</h2>

            <div className="space-y-4 mb-8">
                {/* Paystack Option */}
                <label className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${paymentMethod === "paystack" ? "border-[#FE9900] bg-orange-50" : "border-gray-200 hover:border-gray-300"}`}>
                    <input type="radio" name="paymentMethod" value="paystack" checked={paymentMethod === "paystack"} onChange={() => setPaymentMethod("paystack")} className="hidden" />
                    <FaCreditCard className={`w-6 h-6 mr-4 ${paymentMethod === 'paystack' ? 'text-[#FE9900]' : 'text-gray-400'}`} />
                    <div>
                        <p className="font-semibold text-[#081C3C]">Pay with Card / Paystack</p>
                        <p className="text-sm text-gray-500">Instant activation via Card, USSD, or Bank Transfer.</p>
                    </div>
                    {paymentMethod === "paystack" && <FaCheckCircle className="ml-auto text-[#FE9900]" />}
                </label>

                {/* Bank Transfer Option */}
                <label className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${paymentMethod === "bank_transfer" ? "border-[#FE9900] bg-orange-50" : "border-gray-200 hover:border-gray-300"}`}>
                    <input type="radio" name="paymentMethod" value="bank_transfer" checked={paymentMethod === "bank_transfer"} onChange={() => setPaymentMethod("bank_transfer")} className="hidden" />
                    <FaUniversity className={`w-6 h-6 mr-4 ${paymentMethod === 'bank_transfer' ? 'text-[#FE9900]' : 'text-gray-400'}`} />
                    <div>
                        <p className="font-semibold text-[#081C3C]">Manual Bank Transfer</p>
                        <p className="text-sm text-gray-500">Transfer to our account and upload proof.</p>
                    </div>
                    {paymentMethod === "bank_transfer" && <FaCheckCircle className="ml-auto text-[#FE9900]" />}
                </label>
            </div>

            <button onClick={handleProceed} disabled={isLoading} className="w-full flex justify-center items-center px-6 py-4 bg-[#FE9900] text-white font-bold text-lg rounded-xl shadow-md hover:bg-[#e6a200] transition disabled:opacity-70 disabled:cursor-not-allowed">
                {isLoading ? (
                    <>
                        <FaSpinner className="mr-2 h-5 w-5 animate-spin" />
                        Processing...
                    </>
                ) : (
                    `Proceed to Pay ₦${amount.toLocaleString()}`
                )}
            </button>
        </div>
    );
}