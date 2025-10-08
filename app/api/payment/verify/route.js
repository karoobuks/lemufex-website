import connectedDB from "@/config/database";
import Payment from "@/models/Payment";
import Trainee from "@/models/Trainee";
import Course from "@/models/Course";
import { NextResponse } from "next/server";

export async function GET(req) {
  await connectedDB()

  const { searchParams} = new URL(req.url)
  const reference = searchParams.get("reference");
  const userId = searchParams.get("userId");
   const paymentId = searchParams.get("paymentId");

  if(!reference ){
    return NextResponse.json({ error:"Missing reference"}, { status: 400});
  }

  try {
    const res = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,{
        headers:{
          Authorization:`Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );
    const data = await res.json();

   

    if(data.status && data.data.status === "success"){
       let payment = await Payment.findOne({ _id: paymentId, reference }).populate("course");

      if(!payment) {
        return NextResponse.json(
          {error: "Payment record not found"},
          {status: 404}
        );
      }

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

          let updateFields = {
        paidAt: new Date(data.data.paid_at),
        gateway_response: data.data.gateway_response,
      };

      // 4. Handle installments
      if (payment.paymentType === "installment") {
        const course = await Course.findById(payment.course._id);

        // fetch all previous successful installments for this user+course
        const prevPayments = await Payment.find({
          userId: payment.userId,
          course: payment.course._id,
          status: { $in: ["success", "completed"] },
        }).lean();

        const prevSum = prevPayments.reduce(
          (sum, p) => sum + (p.amount || 0),
          0
        );

        const totalPaid = prevSum + (payment.amount || 0);
        const totalDue = course.prices.full;
        const amountDue = Math.max(totalDue - totalPaid, 0);

        const prevInstallments = prevPayments.filter(
          (p) => p.paymentType === "installment"
        ).length;
        const currentInstallment = prevInstallments + 1;

        updateFields.currentInstallment = currentInstallment;
        updateFields.amountDue = amountDue;
        updateFields.status = amountDue === 0 ? "completed" : "success";
      } else {
        // full payment
        updateFields.status = "completed";
        updateFields.amountDue = 0;
        updateFields.currentInstallment = payment.currentInstallment || 0;
      }


      payment = await Payment.findByIdAndUpdate(payment._id, updateFields, { new: true}).populate("course");

      let trainee = await Trainee.findOne({ user: userId});

      const alreadyEnrolled = 
      trainee && trainee.trainings.some((t) => t.course.toString() === payment.course._id.toString());

      if(!trainee) {
        trainee = await Trainee.create({
          user: userId,
          trainings:[
            { track: payment.course.name, course: payment.course._id},
          ],
        });
      } else if(!alreadyEnrolled) {
          trainee.trainings.push({
            track: payment.course.name,
            course: payment.course._id
          });
          await trainee.save()
        }
      
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_DOMAIN}/dashboard?payment=success&course=${payment.course.slug}&reference=${reference}`
      );
    } else{
      await Payment.findOneAndUpdate(
        { _id: paymentId, reference },
        {
          status: "failed",
          gateway_response:data?.data?.gateway_response || "failed",
        },
        { new: true}
      );
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_DOMAIN}/dashboard?payment=failed&reference=${reference}`
      );
    }
  } catch (error) {
    console.error("❌ Error verifying payment:", error);
    return NextResponse.json({ error: "server error"}, { status: 500})
  }
}