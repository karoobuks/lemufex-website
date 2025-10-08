// app/api/trainee/register/route.js
import { NextResponse } from "next/server";
import Trainee from "@/models/Trainee";
import { getServerSession } from "next-auth";
import User from "@/models/User";
import connectedDB from "@/config/database";
import { authOptions } from "@/utils/authOptions";
import Course from "@/models/Course";
import { trackPrices } from "@/utils/trackPrices";

export async function POST(req) {
  await connectedDB();
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const {
      fullName,
      email,
      trainings,
      phone,
      address,
      dob,
      emergencycontact,
      paymentPlan, // 👈 "full" or "installment" from frontend
    } = await req.json();

    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { isTrainee: true },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const existingTrainee = await Trainee.findOne({ user: user._id });
    if (existingTrainee) {
      return NextResponse.json({ error: "Already registered as trainee" }, { status: 400 });
    }

    // ✅ Normalize trainings
    let formattedTrainings = [];
    if (typeof trainings === "string") {
      formattedTrainings.push({ track: trainings });
    } else if (Array.isArray(trainings)) {
      formattedTrainings = trainings.map((track) =>
        typeof track === "string" ? { track } : track
      );
    }

    const enrichedTrainings = [];
    for(let training of formattedTrainings) {
      const course = await Course.findOne({name:training.track});

      if(!course){
        return NextResponse.json(
          {error:`Course not found for track: ${training.track}`},
          {status:400}
        );
      }
      enrichedTrainings.push({
        track:training.track,
        course:course._id,
        enrolledAt:new Date(),
        totalModules: course.totalModules,
        completedModules:0
      })
    }

    // ✅ Get prices for first selected track
    const primaryTrack = formattedTrainings[0]?.track;
    const prices = trackPrices[primaryTrack];
    if (!prices) {
      return NextResponse.json({ error: "Invalid track selected" }, { status: 400 });
    }

    // ✅ Calculate payment details
    let currentInstallment = 0;
    let amountDue = 0;

    if (paymentPlan === "full") {
      currentInstallment = 0;
      amountDue = 0; // They will pay the full amount at initiation
    } else if (paymentPlan === "installment") {
      currentInstallment = 1; // first installment to be paid
      amountDue = prices.full - prices.installment; // balance left after first payment
    }

    // ✅ Create trainee
    const newTrainee = await Trainee.create({
      user: user._id,
      fullName,
      email,
      trainings: enrichedTrainings,
      phone,
      address,
      dob,
      emergencycontact,
      fullPrice: prices.full,
      installmentPrice: prices.installment,
      paymentType: paymentPlan,
      currentInstallment,
      amountDue,
    });

    user.isTrainee = true;
    await user.save();

    return NextResponse.json(
      { success: "Trainee successfully registered", user: newTrainee },
      { status: 201 }
    );
  } catch (error) {
    console.log("❌ Registration error:", error);
    return NextResponse.json(
      { error: "Registration failed, something went wrong" },
      { status: 500 }
    );
  }
}

