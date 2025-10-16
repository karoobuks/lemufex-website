import connectedDB from "@/config/database";
import Payment from "@/models/Payment";
import Trainee from "@/models/Trainee";
import Course from "@/models/Course";
import { NextResponse } from "next/server";

export async function GET(req) {
  await connectedDB()

  const { searchParams} = new URL(req.url)
  const reference = searchParams.get("reference");

  if(!reference ){
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/dashboard/profile?payment=failed&error=missing-reference`
    );
  }

  try {
    // Verify with Paystack
    const res = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,{
        headers:{
          Authorization:`Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );
    const data = await res.json();

    console.log('Paystack verification response:', data);

    if(data.status && data.data.status === "success"){
       let payment = await Payment.findOne({ reference }).populate("course");

      if(!payment) {
        console.error('Payment not found for reference:', reference);
        return NextResponse.redirect(
          `${process.env.NEXTAUTH_URL}/dashboard/profile?payment=failed&error=payment-not-found&reference=${reference}`
        );
      }

      console.log('Found payment:', payment._id, payment.status);

    //   let updateFields = {
    //     status:"success",
    //     paidAT: new Date(data.data.paid_at),
    //     gateway_response: data.data.gateway_response,
    //   };

    //   if (payment.paymentType === "installment"){
    //     const course = await Course.findById(payment.course._id)
      

    //   const nextInstallment = (payment.currentInstallment || 0) + 1;

    //   const totalDue = course.prices.full;
    //   const installmentPaid = course.prices.installment * nextInstallment;
    //   const amountDue = Math.max(totalDue - installmentPaid, 0);

    //   updateFields.currentInstallment = nextInstallment;
    //   updateFields.amountDue = amountDue;

    //   if (amountDue === 0) {
    //     updateFields.status = "completed";
    //   }
    // }

      // Update payment status
      let updateFields = {
        status: "success",
        paidAt: new Date(data.data.paid_at),
        gateway_response: data.data.gateway_response,
      };

      // Handle installments
      if (payment.paymentType === "installment") {
        // Get course or use default pricing
        let course = null;
        if (payment.course) {
          course = await Course.findById(payment.course._id);
        }

        // Default course prices if no course found
        const coursePrices = {
          'Automation': { full: 150000, installment: 80000 },
          'Electrical Engineering': { full: 120000, installment: 65000 },
          'Software Programming': { full: 100000, installment: 55000 }
        };

        // Get all previous successful payments for this user
        const prevPayments = await Payment.find({
          userId: payment.userId,
          status: { $in: ["success", "completed"] },
          _id: { $ne: payment._id } // Exclude current payment
        }).lean();

        const prevSum = prevPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
        const totalPaid = prevSum + (payment.amount || 0);
        
        // Determine total due amount
        let totalDue = 100000; // Default for Software Programming
        if (course?.prices?.full) {
          totalDue = course.prices.full;
        } else if (payment.course?.name) {
          totalDue = coursePrices[payment.course.name]?.full || 100000;
        }

        const amountDue = Math.max(totalDue - totalPaid, 0);
        const currentInstallment = prevPayments.length + 1;

        updateFields.currentInstallment = currentInstallment;
        updateFields.amountDue = amountDue;
        updateFields.status = amountDue === 0 ? "completed" : "success";
      } else {
        // Full payment
        updateFields.status = "completed";
        updateFields.amountDue = 0;
      }


      // Update payment record
      payment = await Payment.findByIdAndUpdate(payment._id, updateFields, { new: true}).populate("course");
      console.log('Payment updated:', payment.status);

      // Handle trainee enrollment
      const userId = payment.userId;
      let trainee = await Trainee.findOne({ user: userId});

      if (payment.course) {
        const alreadyEnrolled = trainee && trainee.trainings.some((t) => 
          t.course?.toString() === payment.course._id.toString()
        );

        if(!trainee) {
          trainee = await Trainee.create({
            user: userId,
            fullName: data.data.customer?.first_name + ' ' + data.data.customer?.last_name || 'User',
            email: data.data.customer?.email || '',
            phone: data.data.customer?.phone || '',
            emergencycontact: '',
            dob: new Date(),
            trainings:[
              { track: payment.course.name, course: payment.course._id},
            ],
          });
        } else if(!alreadyEnrolled) {
          trainee.trainings.push({
            track: payment.course.name,
            course: payment.course._id
          });
          await trainee.save();
        }
      }
      
      // Redirect based on payment type and context
      if (payment.paymentType === 'completion' || payment.currentInstallment >= 2) {
        // Completion payments go to profile
        return NextResponse.redirect(
          `${process.env.NEXTAUTH_URL}/dashboard/profile?payment=completed&reference=${reference}`
        );
      } else {
        // New user payments go to dashboard
        const courseSlug = payment.course?.slug || 'course';
        return NextResponse.redirect(
          `${process.env.NEXTAUTH_URL}/dashboard?payment=success&course=${courseSlug}&reference=${reference}`
        );
      }
    } else{
      console.log('Payment failed or not successful:', data);
      await Payment.findOneAndUpdate(
        { reference },
        {
          status: "failed",
          gateway_response: data?.data?.gateway_response || "Payment failed",
        },
        { new: true}
      );
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/dashboard/profile?payment=failed&reference=${reference}`
      );
    }
  } catch (error) {
    console.error("❌ Error verifying payment:", error);
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/dashboard/profile?payment=failed&reference=${reference}`
    );
  }
}