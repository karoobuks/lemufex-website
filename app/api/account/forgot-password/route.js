// app/api/account/forgot-password/route.js

import crypto from "crypto";
import connectedDB from "@/config/database";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { sendPasswordResetEmail } from "@/utils/mailer";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    await connectedDB();

    // check user
    const user = await User.findOne({ email });

    // generate reset token
    const token = crypto.randomBytes(32).toString("hex");

    const tokenExpires = Date.now() + 1000 * 60 * 15; // 15 minutes

    // Only generate and send a token if the user exists.
    // This avoids unnecessary database writes and email sending for non-existent users,
    // while still returning a generic message to prevent user enumeration.
    if (user) {
      user.resetToken = token;
      user.resetTokenExpiry = tokenExpires;
      await user.save();

      // create reset link and send email
      const resetUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/reset-password?token=${token}`;
      await sendPasswordResetEmail(email, resetUrl);
    }

    return NextResponse.json({
      message: "If an account with that email exists, a password reset link has been sent.",
    });

  } catch (error) {
    console.error("Forgot password error:", error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}