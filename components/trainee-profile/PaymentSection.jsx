// 'use client';
// import { useState, useEffect } from 'react';
// import { useSession } from 'next-auth/react';
// import { FaCreditCard, FaCheckCircle, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';
// import toast from 'react-hot-toast';

// export default function PaymentSection({ courseId, track }) {
//   const [paymentStatuses, setPaymentStatuses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [processingCourseId, setProcessingCourseId] = useState(null);
//   const { data: session } = useSession();

//   useEffect(() => {
//     if (session?.user?.id) {
//       fetchAllPaymentStatuses();
//     }
//   }, [session]);

// // ✅ Improved version of fetchAllPaymentStatuses()
// const fetchAllPaymentStatuses = async () => {
//   try {
//     setLoading(true);
//     const res = await fetch("/api/payment/status");
//     const paymentData = await res.json();

//     if (!paymentData?.payments) return;

//     const updatedStatuses = trainings.map((training) => {
//       const totalAmount =
//         training.course?.prices?.full || training.course?.prices || 0;

//       // 🧩 Normalize both course IDs (handles Object, ObjectId, or string)
//       const coursePayments = (paymentData?.payments || []).filter((p) => {
//         const paymentCourseId =
//           typeof p.course === "string"
//             ? p.course
//             : p.course?._id?.toString() ||
//               p.course?.id?.toString() ||
//               null;

//         const trainingCourseId =
//           typeof training.course === "string"
//             ? training.course
//             : training.course?._id?.toString() || null;

//         return (
//           paymentCourseId &&
//           trainingCourseId &&
//           paymentCourseId === trainingCourseId
//         );
//       });

//       // ✅ Calculate paid and pending amounts properly
//       const paidAmount = coursePayments
//         .filter((p) => ["success", "completed"].includes(p.status))
//         .reduce((sum, p) => sum + (p.amount || 0), 0);

//       const pendingAmount = Math.max(0, totalAmount - paidAmount);

//       // ✅ Set status labels
//       let statusLabel = "Pending";
//       if (paidAmount > 0 && paidAmount < totalAmount) {
//         statusLabel = "Partially Paid (Installment)";
//       } else if (paidAmount >= totalAmount) {
//         statusLabel = "Fully Paid";
//       }

//       return {
//         ...training,
//         totalAmount,
//         paidAmount,
//         pendingAmount,
//         statusLabel,
//       };
//     });

//     setPaymentStatuses(updatedStatuses);
//   } catch (error) {
//     console.error("Error fetching payment status:", error);
//   } finally {
//     setLoading(false);
//   }
// };


//   const handleCompletePayment = async (courseId, amount) => {
//     if (!amount || !courseId) {
//       toast.error('Missing payment information');
//       return;
//     }

//     // Set processing for only this specific course
//     setProcessingCourseId(courseId);
//     try {
//       const response = await fetch('/api/payment/complete', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           amount: Number(amount),
//           courseId: typeof courseId === 'object' ? courseId._id : courseId
//         })
//       });

//       const data = await response.json();
      
//       if (response.ok && (data.authorizationUrl || data.authorization_url)) {
//         window.location.href = data.authorizationUrl || data.authorization_url;
//       } else {
//         console.error('Payment API response:', data);
//         toast.error(data.error || 'Failed to initiate payment');
//       }
//     } catch (error) {
//       toast.error('Payment initiation failed');
//     } finally {
//       setProcessingCourseId(null);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
//         <div className="flex items-center justify-center py-8">
//           <FaSpinner className="animate-spin text-[#FE9900] text-2xl" />
//         </div>
//       </div>
//     );
//   }

//   if (paymentStatuses.length === 0) {
//     return (
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
//         <div className="flex items-center gap-3 mb-4">
//           <FaCreditCard className="text-[#FE9900] text-xl" />
//           <h3 className="text-lg font-semibold text-[#081C3C]">Payment Status</h3>
//         </div>
//         <p className="text-gray-600">No payment information available</p>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
//       <div className="flex items-center gap-3 mb-6">
//         <FaCreditCard className="text-[#FE9900] text-xl" />
//         <h3 className="text-lg font-semibold text-[#081C3C]">Payment Status</h3>
//       </div>

//       <div className="space-y-6">
//         {paymentStatuses.map((paymentStatus, index) => {
//           const { courseId, courseName, totalAmount, paidAmount, pendingAmount, paymentType, isCompleted } = paymentStatus;
          
//           return (
//             <div key={index} className="border border-gray-200 rounded-lg p-4">
//               <h4 className="text-lg font-semibold text-[#002B5B] mb-4">{courseName}</h4>
              
//               <div className="space-y-4">
//         {/* Payment Summary */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//           <div className="bg-[#F8F9FC] rounded-lg p-4">
//             <p className="text-sm text-gray-600 mb-1">Total Course Fee</p>
//             <p className="text-lg font-semibold text-[#081C3C]">₦{totalAmount?.toLocaleString()}</p>
//           </div>
//           <div className="bg-[#F8F9FC] rounded-lg p-4">
//             <p className="text-sm text-gray-600 mb-1">Amount Paid</p>
//             <p className="text-lg font-semibold text-green-600">₦{paidAmount?.toLocaleString()}</p>
//           </div>
//           <div className="bg-[#F8F9FC] rounded-lg p-4">
//             <p className="text-sm text-gray-600 mb-1">{pendingAmount > 0 ? 'Amount Due' : 'Balance'}</p>
//             <p className={`text-lg font-semibold ${pendingAmount > 0 ? 'text-[#FE9900]' : 'text-green-600'}`}>
//               ₦{pendingAmount?.toLocaleString()}
//             </p>
//           </div>
//         </div>

//         {/* Payment Progress Bar */}
//         {paymentType === 'installment' && (
//           <div className="bg-[#F8F9FC] rounded-lg p-4">
//             <div className="flex justify-between items-center mb-2">
//               <span className="text-sm text-gray-600">Payment Progress</span>
//               <span className="text-sm font-medium text-[#081C3C]">
//                 {Math.round((paidAmount / totalAmount) * 100)}% Complete
//               </span>
//             </div>
//             <div className="w-full bg-gray-200 rounded-full h-2">
//               <div 
//                 className="bg-gradient-to-r from-[#FE9900] to-[#F8C400] h-2 rounded-full transition-all duration-300"
//                 style={{ width: `${Math.min((paidAmount / totalAmount) * 100, 100)}%` }}
//               ></div>
//             </div>
//             <div className="flex justify-between text-xs text-gray-500 mt-1">
//               <span>₦0</span>
//               <span>₦{totalAmount?.toLocaleString()}</span>
//             </div>
//           </div>
//         )}

//         {/* Payment Type */}
//         <div className="flex items-center gap-2">
//           <span className="text-sm text-gray-600">Payment Type:</span>
//           <span className={`px-3 py-1 rounded-full text-xs font-medium ${
//             paymentType === 'full' 
//               ? 'bg-green-100 text-green-800' 
//               : 'bg-[#002B5B]/10 text-[#002B5B]'
//           }`}>
//             {paymentType === 'full' ? 'Full Payment' : 'Installment Payment'}
//           </span>
//         </div>

//         {/* Status */}
//         <div className="flex items-center gap-2">
//           {isCompleted ? (
//             <>
//               <FaCheckCircle className="text-green-500" />
//               <span className="text-green-600 font-medium">Payment Completed</span>
//             </>
//           ) : (
//             <>
//               <FaExclamationTriangle className="text-[#FE9900]" />
//               <span className="text-[#FE9900] font-medium">Payment Pending</span>
//             </>
//           )}
//         </div>

//         {/* Complete Payment Button */}
//         {!isCompleted && pendingAmount > 0 && (
//           <div className="pt-4 border-t border-gray-100">
//             <div className="bg-[#002B5B]/5 border border-[#002B5B]/20 rounded-lg p-4 mb-4">
//               <div className="flex items-center gap-2 mb-2">
//                 <FaExclamationTriangle className="text-[#002B5B]" />
//                 <span className="font-medium text-[#002B5B]">Payment Required</span>
//               </div>
//               <p className="text-sm text-[#002B5B]/80">
//                 You have an outstanding balance of <strong>₦{pendingAmount?.toLocaleString()}</strong> to complete your course enrollment.
//               </p>
//             </div>
//             <button
//               onClick={() => {
//                 console.log('Payment data:', { courseId, pendingAmount });
//                 handleCompletePayment(courseId, pendingAmount);
//               }}
//               disabled={processingCourseId === courseId || !courseId || !pendingAmount}
//               className="w-full bg-[#FE9900] hover:bg-[#F8C400] text-white py-3 px-6 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//             >
//               {processingCourseId === courseId ? (
//                 <>
//                   <FaSpinner className="animate-spin" />
//                   Processing...
//                 </>
//               ) : (
//                 <>
//                   <FaCreditCard />
//                   Pay Remaining Balance (₦{pendingAmount?.toLocaleString()})
//                 </>
//               )}
//             </button>
//             <p className="text-xs text-gray-500 mt-2 text-center">
//               Secure payment powered by Paystack
//             </p>
//           </div>
//         )}
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }


// 'use client';
// import { useState, useEffect } from 'react';
// import { useSession } from 'next-auth/react';
// import { FaCreditCard, FaCheckCircle, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';
// import toast from 'react-hot-toast';

// export default function PaymentSection() {
//   const [paymentStatus, setPaymentStatus] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [processing, setProcessing] = useState(false);
//   const { data: session } = useSession();

//   useEffect(() => {
//     if (session?.user?.id) {
//       fetchPaymentStatus();
//     }
//   }, [session]);

//   // ✅ Simplified + Correct fetch
//   const fetchPaymentStatus = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch('/api/payment/status');
//       const data = await res.json();

//       if (res.ok && data) {
//         setPaymentStatus(data);
//       } else {
//         setPaymentStatus(null);
//       }
//     } catch (err) {
//       console.error('Error fetching payment status:', err);
//       setPaymentStatus(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCompletePayment = async () => {
//     if (!paymentStatus?.courseId || !paymentStatus?.pendingAmount) {
//       toast.error('Missing payment details.');
//       return;
//     }

//     try {
//       setProcessing(true);
//       const response = await fetch('/api/payment/complete', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           amount: Number(paymentStatus.pendingAmount),
//           courseId:
//             typeof paymentStatus.courseId === 'object'
//               ? paymentStatus.courseId._id
//               : paymentStatus.courseId,
//         }),
//       });

//       const data = await response.json();
//       if (response.ok && (data.authorizationUrl || data.authorization_url)) {
//         window.location.href = data.authorizationUrl || data.authorization_url;
//       } else {
//         console.error('Payment API error:', data);
//         toast.error(data.error || 'Failed to initiate payment');
//       }
//     } catch (err) {
//       console.error('Error completing payment:', err);
//       toast.error('Payment initiation failed');
//     } finally {
//       setProcessing(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
//         <div className="flex items-center justify-center py-8">
//           <FaSpinner className="animate-spin text-[#FE9900] text-2xl" />
//         </div>
//       </div>
//     );
//   }

//   if (!paymentStatus) {
//     return (
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
//         <div className="flex items-center gap-3 mb-4">
//           <FaCreditCard className="text-[#FE9900] text-xl" />
//           <h3 className="text-lg font-semibold text-[#081C3C]">Payment Status</h3>
//         </div>
//         <p className="text-gray-600">No payment information available</p>
//       </div>
//     );
//   }

//   const {
//     track,
//     totalAmount,
//     paidAmount,
//     pendingAmount,
//     paymentType,
//     isCompleted,
//   } = paymentStatus;

//   return (
//     <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
//       <div className="flex items-center gap-3 mb-6">
//         <FaCreditCard className="text-[#FE9900] text-xl" />
//         <h3 className="text-lg font-semibold text-[#081C3C]">Payment Status</h3>
//       </div>

//       <div className="border border-gray-200 rounded-lg p-4">
//         <h4 className="text-lg font-semibold text-[#002B5B] mb-4">{track}</h4>

//         {/* Payment Summary */}
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//           <div className="bg-[#F8F9FC] rounded-lg p-4">
//             <p className="text-sm text-gray-600 mb-1">Total Fee</p>
//             <p className="text-lg font-semibold text-[#081C3C]">
//               ₦{totalAmount?.toLocaleString()}
//             </p>
//           </div>
//           <div className="bg-[#F8F9FC] rounded-lg p-4">
//             <p className="text-sm text-gray-600 mb-1">Amount Paid</p>
//             <p className="text-lg font-semibold text-green-600">
//               ₦{paidAmount?.toLocaleString()}
//             </p>
//           </div>
//           <div className="bg-[#F8F9FC] rounded-lg p-4">
//             <p className="text-sm text-gray-600 mb-1">
//               {pendingAmount > 0 ? 'Amount Due' : 'Balance'}
//             </p>
//             <p
//               className={`text-lg font-semibold ${
//                 pendingAmount > 0 ? 'text-[#FE9900]' : 'text-green-600'
//               }`}
//             >
//               ₦{pendingAmount?.toLocaleString()}
//             </p>
//           </div>
//         </div>

//         {/* Payment Progress */}
//         {paymentType === 'installment' && (
//           <div className="mt-4 bg-[#F8F9FC] rounded-lg p-4">
//             <div className="flex justify-between items-center mb-2">
//               <span className="text-sm text-gray-600">Payment Progress</span>
//               <span className="text-sm font-medium text-[#081C3C]">
//                 {Math.round((paidAmount / totalAmount) * 100)}% Complete
//               </span>
//             </div>
//             <div className="w-full bg-gray-200 rounded-full h-2">
//               <div
//                 className="bg-gradient-to-r from-[#FE9900] to-[#F8C400] h-2 rounded-full transition-all duration-300"
//                 style={{
//                   width: `${Math.min((paidAmount / totalAmount) * 100, 100)}%`,
//                 }}
//               ></div>
//             </div>
//           </div>
//         )}

//         {/* Status */}
//         <div className="mt-4 flex items-center gap-2">
//           {isCompleted ? (
//             <>
//               <FaCheckCircle className="text-green-500" />
//               <span className="text-green-600 font-medium">Payment Completed</span>
//             </>
//           ) : paidAmount > 0 ? (
//             <>
//               <FaExclamationTriangle className="text-[#FE9900]" />
//               <span className="text-[#FE9900] font-medium">
//                 Partially Paid (Installment)
//               </span>
//             </>
//           ) : (
//             <>
//               <FaExclamationTriangle className="text-[#FE9900]" />
//               <span className="text-[#FE9900] font-medium">Payment Pending</span>
//             </>
//           )}
//         </div>

//         {/* Complete Payment Button */}
//         {!isCompleted && pendingAmount > 0 && (
//           <div className="pt-4 border-t border-gray-100 mt-4">
//             <button
//               onClick={handleCompletePayment}
//               disabled={processing}
//               className="w-full bg-[#FE9900] hover:bg-[#F8C400] text-white py-3 px-6 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//             >
//               {processing ? (
//                 <>
//                   <FaSpinner className="animate-spin" />
//                   Processing...
//                 </>
//               ) : (
//                 <>
//                   <FaCreditCard />
//                   Pay Remaining Balance (₦{pendingAmount?.toLocaleString()})
//                 </>
//               )}
//             </button>
//             <p className="text-xs text-gray-500 mt-2 text-center">
//               Secure payment powered by Paystack
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


// 'use client';
// import { useState, useEffect } from 'react';
// import { useSession } from 'next-auth/react';
// import {
//   FaCreditCard,
//   FaCheckCircle,
//   FaExclamationTriangle,
//   FaSpinner,
// } from 'react-icons/fa';
// import toast from 'react-hot-toast';

// export default function PaymentSection() {
//   const [paymentStatus, setPaymentStatus] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [processingCourse, setProcessingCourse] = useState(null);
//   const { data: session } = useSession();

//   useEffect(() => {
//     if (session?.user?.id) {
//       fetchPaymentStatus();
//     }
//   }, [session]);

//   const fetchPaymentStatus = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch('/api/payment/status', { cache: 'no-store' });
//       const data = await res.json();
//       if (res.ok && data) setPaymentStatus(data);
//       else setPaymentStatus(null);
//     } catch (err) {
//       console.error('Error fetching payment status:', err);
//       setPaymentStatus(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCompletePayment = async (course) => {
//     if (!course?.courseId || !course?.pendingAmount) {
//       toast.error('Missing payment details.');
//       return;
//     }

//     try {
//       setProcessingCourse(course.courseId);
//       const res = await fetch('/api/payment/complete', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           amount: Number(course.pendingAmount),
//           courseId: course.courseId,
//         }),
//       });
//       const data = await res.json();
//       if (res.ok && (data.authorizationUrl || data.authorization_url)) {
//         window.location.href = data.authorizationUrl || data.authorization_url;
//       } else {
//         toast.error(data.error || 'Failed to initiate payment');
//       }
//     } catch (err) {
//       toast.error('Payment initiation failed');
//     } finally {
//       setProcessingCourse(null);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
//         <div className="flex items-center justify-center py-8">
//           <FaSpinner className="animate-spin text-[#FE9900] text-2xl" />
//         </div>
//       </div>
//     );
//   }

//   if (!paymentStatus?.courses?.length) {
//     return (
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
//         <div className="flex items-center gap-3 mb-4">
//           <FaCreditCard className="text-[#FE9900] text-xl" />
//           <h3 className="text-lg font-semibold text-[#081C3C]">
//             Payment Status
//           </h3>
//         </div>
//         <p className="text-gray-600">No payment information available</p>
//       </div>
//     );
//   }

//   const { courses, summary = {} } = paymentStatus;

//   return (
//     <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
//       <div className="flex items-center gap-3 mb-6">
//         <FaCreditCard className="text-[#FE9900] text-xl" />
//         <h3 className="text-lg font-semibold text-[#081C3C]">
//           Payment Overview
//         </h3>
//       </div>

//       {/* Summary section */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
//         <div className="bg-[#F8F9FC] rounded-lg p-4">
//           <p className="text-sm text-gray-600 mb-1">Total Courses</p>
//           <p className="text-lg font-semibold text-[#081C3C]">
//             {summary.totalCourses || 0}
//           </p>
//         </div>
//         <div className="bg-[#F8F9FC] rounded-lg p-4">
//           <p className="text-sm text-gray-600 mb-1">Total Paid</p>
//           <p className="text-lg font-semibold text-green-600">
//             ₦{summary.totalPaidAll?.toLocaleString() || 0}
//           </p>
//         </div>
//         <div className="bg-[#F8F9FC] rounded-lg p-4">
//           <p className="text-sm text-gray-600 mb-1">Total Pending</p>
//           <p className="text-lg font-semibold text-[#FE9900]">
//             ₦{summary.pendingAll?.toLocaleString() || 0}
//           </p>
//         </div>
//       </div>

//       {/* Course list */}
//       <div className="space-y-6">
//         {courses.map((course) => {
//           const progress = Math.round(
//             (course.paidAmount / course.totalAmount) * 100
//           );

//           return (
//             <div key={course.courseId} className="border border-gray-200 rounded-lg p-4">
//               <h4 className="text-lg font-semibold text-[#002B5B] mb-4">
//                 {course.track}
//               </h4>

//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                 <div className="bg-[#F8F9FC] rounded-lg p-4">
//                   <p className="text-sm text-gray-600 mb-1">Total Fee</p>
//                   <p className="text-lg font-semibold text-[#081C3C]">
//                     ₦{course.totalAmount?.toLocaleString()}
//                   </p>
//                 </div>
//                 <div className="bg-[#F8F9FC] rounded-lg p-4">
//                   <p className="text-sm text-gray-600 mb-1">Amount Paid</p>
//                   <p className="text-lg font-semibold text-green-600">
//                     ₦{course.paidAmount?.toLocaleString()}
//                   </p>
//                 </div>
//                 <div className="bg-[#F8F9FC] rounded-lg p-4">
//                   <p className="text-sm text-gray-600 mb-1">
//                     {course.pendingAmount > 0 ? 'Amount Due' : 'Balance'}
//                   </p>
//                   <p
//                     className={`text-lg font-semibold ${
//                       course.pendingAmount > 0
//                         ? 'text-[#FE9900]'
//                         : 'text-green-600'
//                     }`}
//                   >
//                     ₦{course.pendingAmount?.toLocaleString()}
//                   </p>
//                 </div>
//               </div>

//               {/* Progress */}
//               <div className="mt-4 bg-[#F8F9FC] rounded-lg p-4">
//                 <div className="flex justify-between items-center mb-2">
//                   <span className="text-sm text-gray-600">Progress</span>
//                   <span className="text-sm font-medium text-[#081C3C]">
//                     {progress}% Complete
//                   </span>
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-2">
//                   <div
//                     className="bg-gradient-to-r from-[#FE9900] to-[#F8C400] h-2 rounded-full transition-all duration-300"
//                     style={{ width: `${Math.min(progress, 100)}%` }}
//                   ></div>
//                 </div>
//               </div>

//               {/* Status */}
//               <div className="mt-4 flex items-center gap-2">
//                 {course.isCompleted ? (
//                   <>
//                     <FaCheckCircle className="text-green-500" />
//                     <span className="text-green-600 font-medium">
//                       Payment Completed
//                     </span>
//                   </>
//                 ) : course.paidAmount > 0 ? (
//                   <>
//                     <FaExclamationTriangle className="text-[#FE9900]" />
//                     <span className="text-[#FE9900] font-medium">
//                       Partially Paid (Installment)
//                     </span>
//                   </>
//                 ) : (
//                   <>
//                     <FaExclamationTriangle className="text-[#FE9900]" />
//                     <span className="text-[#FE9900] font-medium">
//                       Payment Pending
//                     </span>
//                   </>
//                 )}
//               </div>

//               {!course.isCompleted && course.pendingAmount > 0 && (
//                 <div className="pt-4 border-t border-gray-100 mt-4">
//                   <button
//                     onClick={() => handleCompletePayment(course)}
//                     disabled={processingCourse === course.courseId}
//                     className="w-full bg-[#FE9900] hover:bg-[#F8C400] text-white py-3 px-6 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
//                   >
//                     {processingCourse === course.courseId ? (
//                       <>
//                         <FaSpinner className="animate-spin" />
//                         Processing...
//                       </>
//                     ) : (
//                       <>
//                         <FaCreditCard />
//                         Pay Remaining Balance (
//                         ₦{course.pendingAmount?.toLocaleString()} )
//                       </>
//                     )}
//                   </button>
//                   <p className="text-xs text-gray-500 mt-2 text-center">
//                     Secure payment powered by Paystack
//                   </p>
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }


// components/PaymentSection.jsx
'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  FaCreditCard,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSpinner,
  FaCalendarAlt,
  FaReceipt,
} from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function PaymentSection() {
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingCourse, setProcessingCourse] = useState(null);
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.id || session?.user?.email) {
      fetchPaymentStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const fetchPaymentStatus = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/payment/status', { cache: 'no-store' });
      const data = await res.json();
      if (res.ok && data) setPaymentStatus(data);
      else setPaymentStatus(null);
    } catch (err) {
      console.error('Error fetching payment status:', err);
      setPaymentStatus(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCompletePayment = async (course) => {
    if (!course?.courseId || !course?.pendingAmount) {
      toast.error('Missing payment details.');
      return;
    }

    try {
      setProcessingCourse(course.courseId);
      const res = await fetch('/api/payment/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Number(course.pendingAmount),
          courseId: course.courseId,
        }),
      });
      const data = await res.json();
      if (res.ok && (data.authorizationUrl || data.authorization_url)) {
        window.location.href = data.authorizationUrl || data.authorization_url;
      } else {
        toast.error(data.error || 'Failed to initiate payment');
      }
    } catch (err) {
      console.error('Error initiating completion payment:', err);
      toast.error('Payment initiation failed');
    } finally {
      setProcessingCourse(null);
    }
  };

  const formatCurrency = (n) =>
    typeof n === 'number' ? `₦${n.toLocaleString()}` : '₦0';

  const formatDate = (iso) => {
    if (!iso) return '—';
    try {
      const d = new Date(iso);
      return new Intl.DateTimeFormat('en-GB', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(d);
    } catch {
      return String(iso);
    }
  };

  // helper: normalize stored payments list and course ID comparisons
  const paymentsForCourse = (courseId) => {
    if (!paymentStatus?.payments || !Array.isArray(paymentStatus.payments)) return [];
    return paymentStatus.payments.filter((p) => {
      if (!p) return false;
      // payment.course could be string or object or ObjectId-like
      const paymentCourseId =
        typeof p.course === 'string'
          ? p.course
          : p.course?._id?.toString() || p.course?.toString?.() || null;

      const wantedId = String(courseId);
      return paymentCourseId && paymentCourseId === wantedId;
    });
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

  if (!paymentStatus?.courses || paymentStatus.courses.length === 0) {
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

  const { courses = [], summary = {} } = paymentStatus;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
      <div className="flex items-center gap-3 mb-6">
        <FaCreditCard className="text-[#FE9900] text-xl" />
        <h3 className="text-lg font-semibold text-[#081C3C]">Payment Overview</h3>
      </div>

      {/* summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#F8F9FC] rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Total Courses</p>
          <p className="text-lg font-semibold text-[#081C3C]">
            {summary.totalCourses ?? courses.length}
          </p>
        </div>
        <div className="bg-[#F8F9FC] rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Total Paid</p>
          <p className="text-lg font-semibold text-green-600">
            {formatCurrency(summary.totalPaidAll ?? courses.reduce((s, c) => s + (c.paidAmount || 0), 0))}
          </p>
        </div>
        <div className="bg-[#F8F9FC] rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Total Pending</p>
          <p className="text-lg font-semibold text-[#FE9900]">
            {formatCurrency(summary.pendingAll ?? courses.reduce((s, c) => s + (c.pendingAmount || 0), 0))}
          </p>
        </div>
      </div>

      {/* courses */}
      <div className="space-y-6">
        {courses.map((course) => {
          const progress = course.totalAmount
            ? Math.round(((course.paidAmount || 0) / course.totalAmount) * 100)
            : 0;

          const history = paymentsForCourse(course.courseId).sort((a, b) => {
            const ta = a.paidAt || a.createdAt || a._id?.toString?.();
            const tb = b.paidAt || b.createdAt || b._id?.toString?.();
            return new Date(tb) - new Date(ta);
          });

          return (
            <div key={course.courseId} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-lg font-semibold text-[#002B5B] mb-1">{course.track}</h4>
                  <p className="text-sm text-gray-500">Course ID: {course.courseId}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Status</div>
                  {course.isCompleted ? (
                    <div className="text-green-600 font-medium flex items-center gap-2">
                      <FaCheckCircle /> Completed
                    </div>
                  ) : course.paidAmount > 0 ? (
                    <div className="text-[#FE9900] font-medium flex items-center gap-2">
                      <FaExclamationTriangle /> Partially Paid
                    </div>
                  ) : (
                    <div className="text-[#FE9900] font-medium flex items-center gap-2">
                      <FaExclamationTriangle /> Pending
                    </div>
                  )}
                </div>
              </div>

              {/* amounts grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                <div className="bg-[#F8F9FC] rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Total Fee</p>
                  <p className="text-lg font-semibold text-[#081C3C]">{formatCurrency(course.totalAmount)}</p>
                </div>
                <div className="bg-[#F8F9FC] rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Amount Paid</p>
                  <p className="text-lg font-semibold text-green-600">{formatCurrency(course.paidAmount)}</p>
                </div>
                <div className="bg-[#F8F9FC] rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">{course.pendingAmount > 0 ? 'Amount Due' : 'Balance'}</p>
                  <p className={`text-lg font-semibold ${course.pendingAmount > 0 ? 'text-[#FE9900]' : 'text-green-600'}`}>
                    {formatCurrency(course.pendingAmount)}
                  </p>
                </div>
              </div>

              {/* progress */}
              <div className="mt-4 bg-[#F8F9FC] rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Progress</span>
                  <span className="text-sm font-medium text-[#081C3C]">{progress}% Complete</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-[#FE9900] to-[#F8C400] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
              </div>

              {/* payment history */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-sm text-[#002B5B] flex items-center gap-2">
                    <FaReceipt /> Payment history
                  </div>
                  <div className="text-xs text-gray-500">Installments & completions</div>
                </div>

                {history.length === 0 ? (
                  <div className="text-sm text-gray-600 py-3">No payments recorded for this course.</div>
                ) : (
                  <ul className="space-y-3">
                    {history.map((p) => {
                      const paidAt = p.paidAt || p.createdAt || null;
                      const typeLabel = (p.paymentType || '').toLowerCase() === 'full' ? 'Full' :
                                        (p.paymentType || '').toLowerCase() === 'completion' ? 'Completion' :
                                        'Installment';
                      const statusLabel = p.status || 'unknown';
                      return (
                        <li key={p.reference || p.id || p._id} className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#F3F4F6] flex items-center justify-center text-sm font-semibold text-[#002B5B]">
                              {typeLabel[0]}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-[#081C3C]">
                                {typeLabel} — {formatCurrency(p.amount)}
                              </div>
                              <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                                <FaCalendarAlt /> {formatDate(paidAt)} &middot; Ref: {p.reference || '—'}
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className={`text-xs font-medium ${statusLabel === 'completed' || statusLabel === 'success' ? 'text-green-600' : 'text-[#FE9900]'}`}>
                              {statusLabel?.toUpperCase?.() || statusLabel}
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              {/* CTA */}
              {!course.isCompleted && course.pendingAmount > 0 && (
                <div className="pt-4 border-t border-gray-100 mt-4">
                  <button
                    onClick={() => handleCompletePayment(course)}
                    disabled={processingCourse === course.courseId}
                    className="w-full bg-[#FE9900] hover:bg-[#F8C400] text-white py-3 px-6 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {processingCourse === course.courseId ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <FaCreditCard />
                        Pay Remaining Balance ({formatCurrency(course.pendingAmount)})
                      </>
                    )}
                  </button>
                  <p className="text-xs text-gray-500 mt-2 text-center">Secure payment powered by Paystack</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
