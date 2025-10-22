// import connectedDB from "@/config/database";
// import Payment from "@/models/Payment";
// import Trainee from "@/models/Trainee";
// import Course from "@/models/Course";
// import { NextResponse } from "next/server";

// export async function GET(req) {
//   await connectedDB()

//   const { searchParams} = new URL(req.url)
//   const reference = searchParams.get("reference");

//   if(!reference ){
//     return NextResponse.redirect(
//       `${process.env.NEXTAUTH_URL}/dashboard/profile?payment=failed&error=missing-reference`
//     );
//   }

//   try {
//     // Verify with Paystack
//     const res = await fetch(
//       `https://api.paystack.co/transaction/verify/${reference}`,{
//         headers:{
//           Authorization:`Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
//         },
//       }
//     );
//     const data = await res.json();

//     console.log('Paystack verification response:', data);

//     if(data.status && data.data.status === "success"){
//        let payment = await Payment.findOne({ reference }).populate("course");

//       if(!payment) {
//         console.error('Payment not found for reference:', reference);
//         return NextResponse.redirect(
//           `${process.env.NEXTAUTH_URL}/dashboard/profile?payment=failed&error=payment-not-found&reference=${reference}`
//         );
//       }

//       console.log('Found payment:', payment._id, payment.status);

//       // Update payment status
//       let updateFields = {
//         status: "success",
//         paidAt: new Date(data.data.paid_at),
//         gateway_response: data.data.gateway_response,
//       };

//       // Handle installments
//       if (payment.paymentType === "installment") {
//         // Get course or use default pricing
//         let course = null;
//         if (payment.course) {
//           course = await Course.findById(payment.course._id);
//         }

//         // Default course prices if no course found
//         const coursePrices = {
//           'Automation': { full: 150000, installment: 80000 },
//           'Electrical Engineering': { full: 120000, installment: 65000 },
//           'Software Programming': { full: 100000, installment: 55000 }
//         };

//         // Get all previous successful payments for this user
//         const prevPayments = await Payment.find({
//           userId: payment.userId,
//           status: { $in: ["success", "completed"] },
//           _id: { $ne: payment._id } // Exclude current payment
//         }).lean();

//         const prevSum = prevPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
//         const totalPaid = prevSum + (payment.amount || 0);
        
//         // Determine total due amount
//         let totalDue = 100000; // Default for Software Programming
//         if (course?.prices?.full) {
//           totalDue = course.prices.full;
//         } else if (payment.course?.name) {
//           totalDue = coursePrices[payment.course.name]?.full || 100000;
//         }

//         const amountDue = Math.max(totalDue - totalPaid, 0);
//         const currentInstallment = prevPayments.length + 1;

//         updateFields.currentInstallment = currentInstallment;
//         updateFields.amountDue = amountDue;
//         updateFields.status = amountDue === 0 ? "completed" : "success";
//       } else {
//         // Full payment
//         updateFields.status = "completed";
//         updateFields.amountDue = 0;
//       }


//       // Update payment record
//       payment = await Payment.findByIdAndUpdate(payment._id, updateFields, { new: true}).populate("course");
//       console.log('Payment updated:', payment.status);

//       // Handle trainee enrollment
//       const userId = payment.userId;
//       let trainee = await Trainee.findOne({ user: userId});

//       if (payment.course) {
//         const alreadyEnrolled = trainee && trainee.trainings.some((t) => 
//           t.course?.toString() === payment.course._id.toString()
//         );

//         if(!trainee) {
//           trainee = await Trainee.create({
//             user: userId,
//             fullName: data.data.customer?.first_name + ' ' + data.data.customer?.last_name || 'User',
//             email: data.data.customer?.email || '',
//             phone: data.data.customer?.phone || '',
//             emergencycontact: '',
//             dob: new Date(),
//             trainings:[
//               { track: payment.course.name, course: payment.course._id},
//             ],
//           });
//         } else if(!alreadyEnrolled) {
//           trainee.trainings.push({
//             track: payment.course.name,
//             course: payment.course._id
//           });
//           await trainee.save();
//         }
//       }
      
//       // Redirect based on payment type and context
//       if (payment.paymentType === 'completion' || payment.currentInstallment >= 2) {
//         // Completion payments go to profile
//         return NextResponse.redirect(
//           `${process.env.NEXTAUTH_URL}/dashboard/profile?payment=completed&reference=${reference}`
//         );
//       } else {
//         // New user payments go to dashboard
//         const courseSlug = payment.course?.slug || 'course';
//         return NextResponse.redirect(
//           `${process.env.NEXTAUTH_URL}/dashboard?payment=success&course=${courseSlug}&reference=${reference}`
//         );
//       }
//     } else{
//       console.log('Payment failed or not successful:', data);
//       await Payment.findOneAndUpdate(
//         { reference },
//         {
//           status: "failed",
//           gateway_response: data?.data?.gateway_response || "Payment failed",
//         },
//         { new: true}
//       );
//       return NextResponse.redirect(
//         `${process.env.NEXTAUTH_URL}/dashboard/profile?payment=failed&reference=${reference}`
//       );
//     }
//   } catch (error) {
//     console.error("❌ Error verifying payment:", error);
//     return NextResponse.redirect(
//       `${process.env.NEXTAUTH_URL}/dashboard/profile?payment=failed&reference=${reference}`
//     );
//   }
// }




// // app/api/payment/verify/route.js
// import connectedDB from "@/config/database";
// import Payment from "@/models/Payment";
// import Trainee from "@/models/Trainee";
// import Course from "@/models/Course";
// import getRedis from "@/lib/redis";
// import mongoose from "mongoose";
// import { NextResponse } from "next/server";

// const redis = getRedis();

// /** safeFetch with timeout + retries */
// async function safeFetch(url, options = {}, retries = 2, timeoutMs = 10000) {
//   for (let attempt = 0; attempt <= retries; attempt++) {
//     const controller = new AbortController();
//     const timer = setTimeout(() => controller.abort(), timeoutMs);

//     try {
//       const res = await fetch(url, { ...options, signal: controller.signal });
//       clearTimeout(timer);
//       const json = await res.json();
//       if (!res.ok) throw new Error(`HTTP ${res.status} - ${JSON.stringify(json)}`);
//       return json;
//     } catch (err) {
//       clearTimeout(timer);
//       if (attempt === retries) throw err;
//       // brief backoff before retry
//       await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
//     }
//   }
// }

// /** helper to get cached course (5 minute cache) */
// async function getCourseCached(slugOrId) {
//   // slugOrId can be slug or ObjectId string
//   const isObjectId = mongoose.Types.ObjectId.isValid(String(slugOrId));
//   const key = isObjectId ? `course:id:${slugOrId}` : `course:slug:${String(slugOrId).toLowerCase()}`;
//   const cached = await redis.get(key);
//   if (cached) return JSON.parse(cached);

//   let course;
//   if (isObjectId) {
//     course = await Course.findById(slugOrId).lean();
//   } else {
//     course = await Course.findOne({ slug: new RegExp(`^${slugOrId}$`, "i") }).lean();
//   }
//   if (course) {
//     await redis.set(key, JSON.stringify(course), "EX", 300); // cache 5 minutes
//   }
//   return course;
// }

// export async function GET(req) {
//   await connectedDB();

//   const { searchParams } = new URL(req.url);
//   const reference = searchParams.get("reference");

//   if (!reference) {
//     return NextResponse.redirect(
//       `${process.env.NEXTAUTH_URL}/dashboard/profile?payment=failed&error=missing-reference`
//     );
//   }

//   try {
//     // 1) Verify transaction with Paystack
//     const url = `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`;
//     const paystackResp = await safeFetch(url, {
//       headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
//     });

//     // paystackResp expected shape: { status: true|false, data: { status: 'success'|'failed'|... , ... } }
//     // if (!paystackResp?.status || !paystackResp.data) {
//     //   console.error("Paystack verify returned unexpected payload:", paystackResp);
//     //   // mark payment failed if exists
//     //   await Payment.findOneAndUpdate({ reference }, { status: "failed", gateway_response: JSON.stringify(paystackResp) });
//     //   return NextResponse.redirect(
//     //     `${process.env.NEXTAUTH_URL}/dashboard/profile?payment=failed&reference=${reference}`
//     //   );
//     // }

//     // const payData = paystackResp.data;
//           let payData;
// try {
//   if (!paystackResp || typeof paystackResp !== "object") {
//     throw new Error("Invalid Paystack response");
//   }

//   // Handle paystack response structure gracefully
//   if (paystackResp.status === true && paystackResp.data) {
//     payData = paystackResp.data;
//   } else if (paystackResp.data?.status) {
//     payData = paystackResp.data;
//   } else {
//     throw new Error("Unexpected Paystack payload");
//   }
// } catch (err) {
//   console.error("⚠️ Paystack verification payload issue:", err, paystackResp);
//   await Payment.findOneAndUpdate(
//     { reference },
//     { status: "failed", gateway_response: JSON.stringify(paystackResp || {}) }
//   );
//   return NextResponse.redirect(
//     `${process.env.NEXTAUTH_URL}/dashboard/profile?payment=failed&reference=${reference}`
//   );
// }


//     // If Paystack says not successful, mark failed and redirect
//     if (payData.status !== "success") {
//       await Payment.findOneAndUpdate(
//         { reference },
//         {
//           status: "failed",
//           gateway_response: payData.gateway_response || JSON.stringify(payData),
//         }
//       );
//       return NextResponse.redirect(
//         `${process.env.NEXTAUTH_URL}/dashboard/profile?payment=failed&reference=${reference}`
//       );
//     }

//     // 2) Find payment record (and check idempotency)
//     let payment = await Payment.findOne({ reference }).lean();
//     if (!payment) {
//       console.error("Payment record not found for reference:", reference);
//       // nothing to update in DB, redirect with failure
//       return NextResponse.redirect(
//         `${process.env.NEXTAUTH_URL}/dashboard/profile?payment=failed&error=payment-not-found&reference=${reference}`
//       );
//     }

//     // If payment already completed or success processed, redirect as idempotent
//     if (["success", "completed"].includes(payment.status)) {
//       // redirect to appropriate place based on previous saved info
//       const courseSlug = payment.course?.slug || (payment.course && String(payment.course)) || "";
//       return NextResponse.redirect(
//         `${process.env.NEXTAUTH_URL}/dashboard?payment=already_processed&reference=${reference}&course=${encodeURIComponent(courseSlug)}`
//       );
//     }

//     // 3) Start transaction to atomically update payment and trainee
//     const session = await mongoose.startSession();
//     session.startTransaction();

//     try {
//       // re-fetch payment inside transaction (to be safe)
//       payment = await Payment.findOne({ reference }).session(session);

//       // compute updateFields
//       const updateFields = {
//         gateway_response: payData.gateway_response || JSON.stringify(payData),
//         paidAt: payData.paid_at ? new Date(payData.paid_at) : new Date(),
//       };

//       // handle paymentType logic (installment vs full)
//       if (payment.paymentType === "installment") {
//         // fetch course (from cache or DB)
//         const course = payment.course ? await getCourseCached(payment.course) : null;

//         // get all previous successful payments by this user for this course
//         const prevPayments = await Payment.find({
//           userId: payment.userId,
//           status: { $in: ["success", "completed"] },
//           _id: { $ne: payment._id },
//         })
//           .lean()
//           .session(session);

//         const prevSum = prevPayments.reduce((s, p) => s + (p.amount || 0), 0);
//         const totalPaid = prevSum + (payment.amount || 0);

//         // compute total due
//         let totalDue = 0;
//         if (course?.prices?.full) {
//           totalDue = course.prices.full;
//         } else if (payment.amountDue && payment.amountDue + payment.amount) {
//           // fallback: reconstruct from payment doc if present
//           totalDue = (payment.amountDue || 0) + (payment.amount || 0) + prevSum;
//         } else {
//           // last resort default
//           totalDue = payment.amount + prevSum;
//         }

//         const amountDue = Math.max(totalDue - totalPaid, 0);
//         const currentInstallment = (prevPayments.length || 0) + 1;
//         updateFields.currentInstallment = currentInstallment;
//         updateFields.amountDue = amountDue;
//         updateFields.status = amountDue === 0 ? "completed" : "success";
//       } else {
//         // full payment
//         updateFields.status = "completed";
//         updateFields.amountDue = 0;
//       }

//       // update payment atomically
//       const updatedPayment = await Payment.findByIdAndUpdate(
//         payment._id,
//         { $set: updateFields },
//         { new: true, session }
//       ).populate("course");

//       // 4) Enroll trainee (if course exists) - idempotent
//       if (updatedPayment.course) {
//         // fetch or create trainee
//         let trainee = await Trainee.findOne({ user: updatedPayment.userId }).session(session);

//         // helper to check enrollment
//         const isEnrolled = (t) =>
//           Array.isArray(t.trainings) && t.trainings.some((tr) => String(tr.course) === String(updatedPayment.course._id));

//         if (!trainee) {
//           // create minimal trainee record (do not overwrite existing user info)
//           trainee = await Trainee.create(
//             [
//               {
//                 user: updatedPayment.userId,
//                 fullName:
//                   (payData.customer?.first_name || "") + " " + (payData.customer?.last_name || "") || "Trainee",
//                 email: payData.customer?.email || updatedPayment.email || "",
//                 phone: payData.customer?.phone || "",
//                 emergencycontact: "",
//                 dob: new Date(),
//                 trainings: [
//                   {
//                     track: updatedPayment.course.name || updatedPayment.course.slug || "course",
//                     course: updatedPayment.course._id,
//                     enrolledAt: new Date(),
//                     totalModules: updatedPayment.course.totalModules || 0,
//                     completedModules: 0,
//                   },
//                 ],
//               },
//             ],
//             { session }
//           );
//           trainee = trainee[0];
//         } else if (!isEnrolled(trainee)) {
//           // Fix existing trainings that might be missing course field
//           trainee.trainings = trainee.trainings.map(training => {
//             if (!training.course && training.track) {
//               // Try to find course by track name
//               return {
//                 ...training,
//                 course: updatedPayment.course._id // Use current course as fallback
//               };
//             }
//             return training;
//           });
          
//           // push new training
//           trainee.trainings.push({
//             track: updatedPayment.course.name || updatedPayment.course.slug || "course",
//             course: updatedPayment.course._id,
//             enrolledAt: new Date(),
//             totalModules: updatedPayment.course.totalModules || 0,
//             completedModules: 0,
//           });
//           await trainee.save({ session });
//         } else {
//           // Fix existing trainings that might be missing course field
//           let needsSave = false;
//           trainee.trainings = trainee.trainings.map(training => {
//             if (!training.course && training.track) {
//               needsSave = true;
//               return {
//                 ...training,
//                 course: updatedPayment.course._id // Use current course as fallback
//               };
//             }
//             return training;
//           });
          
//           if (needsSave) {
//             await trainee.save({ session });
//           }
//         }
//       }

//       // commit transaction
//       await session.commitTransaction();
//       session.endSession();

//       // successful redirect - completion payments go to profile
//       if (updatedPayment.paymentType === "completion") {
//         return NextResponse.redirect(
//           `${process.env.NEXTAUTH_URL}/dashboard/profile?payment=completed&reference=${reference}`
//         );
//       } else {
//         const courseSlug = updatedPayment.course?.slug || "course";
//         return NextResponse.redirect(
//           `${process.env.NEXTAUTH_URL}/dashboard?payment=success&course=${encodeURIComponent(courseSlug)}&reference=${reference}`
//         );
//       }
//     } catch (txnErr) {
//       await session.abortTransaction();
//       session.endSession();
//       console.error("Transaction error while verifying payment:", txnErr);
//       // mark payment failed as safe fallback
//       await Payment.findOneAndUpdate({ reference }, { status: "failed", gateway_response: JSON.stringify(payData) });
//       return NextResponse.redirect(
//         `${process.env.NEXTAUTH_URL}/dashboard/profile?payment=failed&reference=${reference}`
//       );
//     }
//   } catch (outerErr) {
//     console.error("Error in payment verification flow:", outerErr);
//     // final fallback redirect
//     return NextResponse.redirect(
//       `${process.env.NEXTAUTH_URL}/dashboard/profile?payment=failed&reference=${reference}`
//     );
//   }
// }




// // app/api/payment/verify/route.js
// import connectedDB from "@/config/database";
// import Payment from "@/models/Payment";
// import Trainee from "@/models/Trainee";
// import Course from "@/models/Course";
// import getRedis from "@/lib/redis";
// import mongoose from "mongoose";
// import { NextResponse } from "next/server";

// const redis = getRedis();

// /** 🔒 Safe Fetch with Timeout + Retries */
// async function safeFetch(url, options = {}, retries = 2, timeoutMs = 10000) {
//   for (let attempt = 0; attempt <= retries; attempt++) {
//     const controller = new AbortController();
//     const timer = setTimeout(() => controller.abort(), timeoutMs);

//     try {
//       const res = await fetch(url, { ...options, signal: controller.signal });
//       clearTimeout(timer);
//       const json = await res.json();
//       if (!res.ok) throw new Error(`HTTP ${res.status} - ${JSON.stringify(json)}`);
//       return json;
//     } catch (err) {
//       clearTimeout(timer);
//       if (attempt === retries) throw err;
//       await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
//     }
//   }
// }

// /** 🧠 Cached course lookup */
// async function getCourseCached(slugOrId) {
//   const isObjectId = mongoose.Types.ObjectId.isValid(String(slugOrId));
//   const key = isObjectId
//     ? `course:id:${slugOrId}`
//     : `course:slug:${String(slugOrId).toLowerCase()}`;
//   const cached = await redis.get(key);
//   if (cached) return JSON.parse(cached);

//   let course;
//   if (isObjectId) {
//     course = await Course.findById(slugOrId).lean();
//   } else {
//     course = await Course.findOne({ slug: new RegExp(`^${slugOrId}$`, "i") }).lean();
//   }
//   if (course) {
//     await redis.set(key, JSON.stringify(course), "EX", 300);
//   }
//   return course;
// }

// export async function GET(req) {
//   await connectedDB();

//   const { searchParams } = new URL(req.url);
//   const reference = searchParams.get("reference");

//   if (!reference) {
//     return NextResponse.redirect(
//       `${process.env.NEXTAUTH_URL}/dashboard/profile?payment=failed&error=missing-reference`
//     );
//   }

//   try {
//     // 1️⃣ Verify with Paystack
//     const url = `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`;
//     const paystackResp = await safeFetch(url, {
//       headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
//     });

//     // Extract Paystack data robustly
//     let payData;
//     if (paystackResp?.status === true && paystackResp?.data) {
//       payData = paystackResp.data;
//     } else if (paystackResp?.data?.status) {
//       payData = paystackResp.data;
//     } else {
//       console.error("Unexpected Paystack payload:", paystackResp);
//       await Payment.findOneAndUpdate(
//         { reference },
//         { status: "failed", gateway_response: JSON.stringify(paystackResp || {}) }
//       );
//       return NextResponse.redirect(
//         `${process.env.NEXTAUTH_URL}/dashboard/profile?payment=failed&reference=${reference}`
//       );
//     }

//     // 2️⃣ If payment not successful → mark failed
//     if (payData.status !== "success") {
//       await Payment.findOneAndUpdate(
//         { reference },
//         {
//           status: "failed",
//           gateway_response: payData.gateway_response || JSON.stringify(payData),
//         }
//       );
//       return NextResponse.redirect(
//         `${process.env.NEXTAUTH_URL}/dashboard/profile?payment=failed&reference=${reference}`
//       );
//     }

//     // 3️⃣ Find payment in DB
//     const payment = await Payment.findOne({ reference });
//     if (!payment) {
//       console.error("⚠️ Payment record not found for reference:", reference);
//       return NextResponse.redirect(
//         `${process.env.NEXTAUTH_URL}/dashboard/profile?payment=failed&error=payment-not-found&reference=${reference}`
//       );
//     }

//     // 4️⃣ Prevent double-processing
//     if (["success", "completed"].includes(payment.status)) {
//       const courseSlug =
//         payment.course?.slug || (payment.course && String(payment.course)) || "";
//       return NextResponse.redirect(
//         `${process.env.NEXTAUTH_URL}/dashboard?payment=already_processed&reference=${reference}&course=${encodeURIComponent(courseSlug)}`
//       );
//     }

//     // 5️⃣ Use MongoDB transaction to update safely
//     const session = await mongoose.startSession();
//     session.startTransaction();

//     try {
//      const paymentDoc = await Payment.findById( payment._id ).session(session);

//       const updateFields = {
//         gateway_response: payData.gateway_response || JSON.stringify(payData),
//         paidAt: payData.paid_at ? new Date(payData.paid_at) : new Date(),
//       };

//      if (paymentDoc.paymentType === "installment") {
//   const course = payment.course ? await getCourseCached(paymentDoc.course) : null;

//   // 🧩 Get *all* previous installments (even pending) for this user/course
//   const prevPayments = await Payment.find({
//     userId: paymentDoc.userId,
//     "course": paymentDoc.course,
//     _id: { $ne: paymentDoc._id },
//   })
//     .session(session)
//     .lean();

//   const totalPaidBefore = prevPayments
//     .filter((p) => ["success", "completed"].includes(p.status))
//     .reduce((sum, p) => sum + (p.amount || 0), 0);

//   const totalPaidNow = totalPaidBefore + (paymentDoc.amount || 0);
//   const totalCourseFee = course?.prices?.full || paymentDoc.amount;

//   const amountDue = Math.max(totalCourseFee - totalPaidNow, 0);

//   // 🧮 Mark current payment progress
//   updateFields.currentInstallment = prevPayments.length + 1;
//   updateFields.amountDue = amountDue;
//   updateFields.status = amountDue === 0 ? "completed" : "success";
// }
//  else {
//         updateFields.status = "completed";
//         updateFields.amountDue = 0;
//       }

//       // ✅ Update payment record
//       const updatedPayment = await Payment.findByIdAndUpdate(
//         paymentDoc._id,
//         { $set: updateFields },
//         { new: true, session }
//       ).populate("course");

//         // ✅ commit transaction
//         await session.commitTransaction();
//         session.endSession();

//         console.log("✅ Payment verified and updated:", updatedPayment);

//       // 6️⃣ Enroll trainee (idempotent)
//       if (updatedPayment.course) {
//         let trainee = await Trainee.findOne({ user: updatedPayment.userId }).session(session);

//         const isEnrolled =
//           trainee &&
//           Array.isArray(trainee.trainings) &&
//           trainee.trainings.some(
//             (tr) => String(tr.course) === String(updatedPayment.course._id)
//           );

//         if (!trainee) {
//           trainee = await Trainee.create(
//             [
//               {
//                 user: updatedPayment.userId,
//                 fullName:
//                   `${payData.customer?.first_name || ""} ${payData.customer?.last_name || ""}`.trim() ||
//                   "Trainee",
//                 email: payData.customer?.email || updatedPayment.email || "",
//                 phone: payData.customer?.phone || "",
//                 dob: new Date(),
//                 trainings: [
//                   {
//                     track:
//                       updatedPayment.course.name ||
//                       updatedPayment.course.slug ||
//                       "course",
//                     course: updatedPayment.course._id,
//                     enrolledAt: new Date(),
//                     totalModules: updatedPayment.course.totalModules || 0,
//                     completedModules: 0,
//                   },
//                 ],
//               },
//             ],
//             { session }
//           );
//           trainee = trainee[0];
//         } else if (!isEnrolled) {
//           trainee.trainings.push({
//             track:
//               updatedPayment.course.name ||
//               updatedPayment.course.slug ||
//               "course",
//             course: updatedPayment.course._id,
//             enrolledAt: new Date(),
//             totalModules: updatedPayment.course.totalModules || 0,
//             completedModules: 0,
//           });
//           await trainee.save({ session });
//         }
//       }

//       await session.commitTransaction();
//       session.endSession();

//       // ✅ Return updated payment for debugging
//       console.log("✅ Payment verified and updated:", updatedPayment);

//       // 7️⃣ Redirect
//       const redirectUrl =
//         updatedPayment.status === "completed"
//           ? `${process.env.NEXTAUTH_URL}/dashboard/profile?payment=completed&reference=${reference}`
//           : `${process.env.NEXTAUTH_URL}/dashboard?payment=success&reference=${reference}`;

//       return NextResponse.redirect(redirectUrl);
//     } catch (txnErr) {
//       await session.abortTransaction();
//       session.endSession();
//       console.error("Transaction error:", txnErr);
//       await Payment.findOneAndUpdate(
//         { reference },
//         { status: "failed", gateway_response: JSON.stringify(payData) }
//       );
//       return NextResponse.redirect(
//         `${process.env.NEXTAUTH_URL}/dashboard/profile?payment=failed&reference=${reference}`
//       );
//     }
//   } catch (outerErr) {
//     console.error("Error in verify flow:", outerErr);
//     return NextResponse.redirect(
//       `${process.env.NEXTAUTH_URL}/dashboard/profile?payment=failed&reference=${reference}`
//     );
//   }
// }


import connectedDB from "@/config/database";
import Payment from "@/models/Payment";
import Trainee from "@/models/Trainee";
import Course from "@/models/Course";
import getRedis from "@/lib/redis";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

const redis = getRedis();

/** 🔒 Safe Fetch with Timeout + Retries */
async function safeFetch(url, options = {}, retries = 2, timeoutMs = 10000) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timer);
      const json = await res.json();
      if (!res.ok) throw new Error(`HTTP ${res.status} - ${JSON.stringify(json)}`);
      return json;
    } catch (err) {
      clearTimeout(timer);
      if (attempt === retries) throw err;
      await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
    }
  }
}

/** 🧠 Cached course lookup */
async function getCourseCached(slugOrId) {
  const isObjectId = mongoose.Types.ObjectId.isValid(String(slugOrId));
  const key = isObjectId
    ? `course:id:${slugOrId}`
    : `course:slug:${String(slugOrId).toLowerCase()}`;
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);

  let course;
  if (isObjectId) {
    course = await Course.findById(slugOrId).lean();
  } else {
    course = await Course.findOne({ slug: new RegExp(`^${slugOrId}$`, "i") }).lean();
  }
  if (course) {
    await redis.set(key, JSON.stringify(course), "EX", 300);
  }
  return course;
}

export async function GET(req) {
  await connectedDB();

  const { searchParams } = new URL(req.url);
  const reference = searchParams.get("reference");

  if (!reference) {
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/dashboard/profile?payment=failed&error=missing-reference`
    );
  }

  try {
    // 1️⃣ Verify with Paystack
    const url = `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`;
    const paystackResp = await safeFetch(url, {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
    });

    let payData;
    if (paystackResp?.status === true && paystackResp?.data) {
      payData = paystackResp.data;
    } else if (paystackResp?.data?.status) {
      payData = paystackResp.data;
    } else {
      console.error("⚠️ Unexpected Paystack payload:", paystackResp);
      await Payment.findOneAndUpdate(
        { reference },
        { status: "failed", gateway_response: JSON.stringify(paystackResp || {}) }
      );
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/dashboard/profile?payment=failed&reference=${reference}`
      );
    }

    // 2️⃣ If payment not successful → mark failed
    if (payData.status !== "success") {
      await Payment.findOneAndUpdate(
        { reference },
        {
          status: "failed",
          gateway_response: payData.gateway_response || JSON.stringify(payData),
        }
      );
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/dashboard/profile?payment=failed&reference=${reference}`
      );
    }

    // 3️⃣ Find payment in DB (⚠️ no .lean())
    const payment = await Payment.findOne({ reference });
    if (!payment) {
      console.error("⚠️ Payment record not found for reference:", reference);
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/dashboard/profile?payment=failed&error=payment-not-found&reference=${reference}`
      );
    }

    // 4️⃣ Prevent double-processing
    if (["success", "completed"].includes(payment.status)) {
      const courseSlug =
        payment.course?.slug || (payment.course && String(payment.course)) || "";
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/dashboard?payment=already_processed&reference=${reference}&course=${encodeURIComponent(courseSlug)}`
      );
    }

    // 5️⃣ Transaction for atomic update
    const session = await mongoose.startSession();
    session.startTransaction();

    let updatedPayment;
    try {
      const paymentDoc = await Payment.findById(payment._id).session(session);

      const updateFields = {
        gateway_response: payData.gateway_response || JSON.stringify(payData),
        paidAt: payData.paid_at ? new Date(payData.paid_at) : new Date(),
      };

      if (paymentDoc.paymentType === "installment") {
        const course = paymentDoc.course
          ? await getCourseCached(paymentDoc.course)
          : null;

        const prevPayments = await Payment.find({
          userId: paymentDoc.userId,
          course: paymentDoc.course,
          _id: { $ne: paymentDoc._id },
        })
          .session(session)
          .lean();

        const totalPaidBefore = prevPayments
          .filter((p) => ["success", "completed"].includes(p.status))
          .reduce((sum, p) => sum + (p.amount || 0), 0);

        const totalPaidNow = totalPaidBefore + (paymentDoc.amount || 0);
        const totalCourseFee = course?.prices?.full || paymentDoc.amount;
        const amountDue = Math.max(totalCourseFee - totalPaidNow, 0);

        updateFields.currentInstallment = prevPayments.length + 1;
        updateFields.amountDue = amountDue;
        updateFields.status = amountDue === 0 ? "completed" : "success";
      } else {
        updateFields.status = "completed";
        updateFields.amountDue = 0;
      }

      updatedPayment = await Payment.findByIdAndUpdate(
        paymentDoc._id,
        { $set: updateFields },
        { new: true, session }
      ).populate("course");

      await session.commitTransaction();
      session.endSession();
      console.log("✅ Payment updated successfully:", updatedPayment);
    } catch (txnErr) {
      await session.abortTransaction();
      session.endSession();
      console.error("❌ Transaction error:", txnErr);
      await Payment.findOneAndUpdate(
        { reference },
        { status: "failed", gateway_response: JSON.stringify(payData) }
      );
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/dashboard/profile?payment=failed&reference=${reference}`
      );
    }

    // 6️⃣ Enroll trainee AFTER transaction
    try {
      if (updatedPayment.course) {
        let trainee = await Trainee.findOne({
          user: updatedPayment.userId,
        });

        const isEnrolled =
          trainee &&
          Array.isArray(trainee.trainings) &&
          trainee.trainings.some(
            (tr) => String(tr.course) === String(updatedPayment.course._id)
          );

        if (!trainee) {
          trainee = await Trainee.create({
            user: updatedPayment.userId,
            fullName:
              `${payData.customer?.first_name || ""} ${payData.customer?.last_name || ""}`.trim() ||
              "Trainee",
            email: payData.customer?.email || updatedPayment.email || "",
            phone: payData.customer?.phone || "0000000000", // 👈 fallback
            emergencycontact: "N/A", // 👈 fallback
            dob: new Date(),
            trainings: [
              {
                track:
                  updatedPayment.course.name ||
                  updatedPayment.course.slug ||
                  "course",
                course: updatedPayment.course._id,
                enrolledAt: new Date(),
                totalModules: updatedPayment.course.totalModules || 0,
                completedModules: 0,
              },
            ],
          });
        } else if (!isEnrolled) {
          trainee.trainings.push({
            track:
              updatedPayment.course.name ||
              updatedPayment.course.slug ||
              "course",
            course: updatedPayment.course._id,
            enrolledAt: new Date(),
            totalModules: updatedPayment.course.totalModules || 0,
            completedModules: 0,
          });
          await trainee.save();
        }
      }
    } catch (enrollErr) {
      console.error("⚠️ Error enrolling trainee:", enrollErr);
    }

    // 7️⃣ Redirect after success
    const redirectUrl =
      updatedPayment.status === "completed"
        ? `${process.env.NEXTAUTH_URL}/dashboard/profile?payment=completed&reference=${reference}`
        : `${process.env.NEXTAUTH_URL}/dashboard?payment=success&reference=${reference}`;

    return NextResponse.redirect(redirectUrl);
  } catch (outerErr) {
    console.error("❌ Error in verify flow:", outerErr);
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/dashboard/profile?payment=failed&reference=${reference}`
    );
  }
}
