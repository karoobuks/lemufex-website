"use client"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useSession } from "next-auth/react"

export default function VerifyPaymentPage() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const reference = searchParams.get("reference");
    const paymentId = searchParams.get("paymentId");
    // const userId = searchParams.get("userId");
    const { data: session} = useSession();
    const userId = session?.user?.id

    const [status, setStatus] = useState("loading")
    const [message, setMessage] = useState("");

    useEffect(() =>{
        const verifyPayment = async () =>{
            try {
            const res = await fetch(
                `/api/payment/verify?reference=${reference}&paymentId=${paymentId}`

            );

            if(res.redirected) {
                router.push(res.url);
                return;
            }

            const data = await res.json()
            if(res.ok){
                setStatus("success");
                setMessage("Payment verified successfully!");
                setTimeout( () =>{
                    router.push(`/dashboard/?payment=success`);
                }, 2000)
            } else{
                setStatus("failed");
                setMessage(data.error || "Payment verification failed.");
            }
        } catch (error) {
            setStatus("failed");
            setMessage("Something went wrong. Please try again.");
        }
        };
        if (reference && paymentId) {
            verifyPayment();
        }
        
    },[reference, paymentId, userId, router]);
    return(
        <div className="flex items-center justify-center h-screen bg-[#0F172A] relative">

            <AnimatePresence>
                {status === "loading" && (
                    <motion.div
                      key="progress"
                      className="absolute top-0 left-0 h-1 bg-[#2563EB]"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%"}}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 2, ease: "easeInOut", repeat: Infinity}}
                    /> 
                )}
            </AnimatePresence>

            <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
                <AnimatePresence mode="wait">
                    {status === "loading" && (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0, scale:0.9}}
                          animate={{ opacity: 1, scale:1}}
                          exit={{ opacity:0, scale:0.9}}
                          transition={{ duration: 0.4 }}
                        >
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#2563EB] border-t-transparent mx-auto"></div>
                            <h2 className="mt-6 text-xl font-semibold text-[#0F172A]">
                                Verifying your payment...
                            </h2>

                            <p className="text-gray-500 mt-2">
                                Please wait while we confirm your transaction,
                            </p>
                        </motion.div>
                    )}

                    { status === "success"  && (
                        <motion.div
                          key="success"
                          initial={{ opacity: 0, scale: 0.8}}
                          animate={{ opacity: 1, scale: 1}}
                          exit={{ opacity: 0, scale: 0.8}}
                          transition={{ duration: 0.4}}
                         >
                            <div className="h-16 w-16 bg-green-500 text-white flex items-center justify-center rounded-full mx-auto">
                                ✓ 
                            </div>
                            <h2 className="mt-6 text-xl font-semibold text-green-600">
                                Payment Successful 🎉
                            </h2>
                            <p className="text-gray-500 mt-2">{message}</p>
                         </motion.div> 

                    )}

                    {status === "failed" &&(
                        <motion.div
                          key="failed"
                          initial={{ opacity: 0, scale:0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity:0, scale:0.8}}
                          transition={{ duration: 0.4}}
                          >
                            <div className="h-16 w-16 bg-red-500 text-white flex items-center justify-center rounded-full mx-auto">
                               ✕   
                            </div>
                            <h2 className="mt-6 text-xl font-semibold text-red-600">
                                Payment Failed
                            </h2>
                            <p className="text-gray-500 mt-2">{message}</p>
                            <button 
                             onClick={() => router.push(`/dashboard/`)}
                             className="mt-4 bg-[#2563EB] text-white px-6 py-2 rounded-lg hover:bg-[#1E40AF] transition"
                            >
                                Go to Dashboard
                            </button>
                          </motion.div>
                    )}
                </AnimatePresence>
            
            </div>

        </div>
    );
}