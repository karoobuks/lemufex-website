// app/api/account/forgot-password/route.js

import crypto from "crypto";
import connectDB from "@/config/database";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { sendPasswordResetEmail } from "@/utils/mailer";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email });

    if (user) {
      // Generate plain token — store it as-is in DB
      const token = crypto.randomBytes(32).toString("hex");
      const tokenExpiry = new Date(Date.now() + 1000 * 60 * 15); // 15 minutes

      user.resetToken = token;
      user.resetTokenExpiry = tokenExpiry;
      await user.save();

      const resetUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/reset-password?token=${token}`;
      await sendPasswordResetEmail(email, resetUrl);
    }

    return NextResponse.json({
      message: "If an account with that email exists, a password reset link has been sent.",
    });

  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}