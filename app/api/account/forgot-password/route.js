
// // app/api/account/forgot-password/route.js
// import crypto from "crypto";
// import connectedDB from "@/config/database";
// import User from "@/models/User";
// import { NextResponse } from "next/server";
// import { sendPasswordResetEmail } from "@/utils/mailer";

// export async function POST(req) {
//   try {
//     const { email } = await req.json();

//     await connectedDB();

//     const user = await User.findOne({ email });
//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 400 });
//     }

//     const token = crypto.randomBytes(32).toString("hex");
//     const tokenExpires = Date.now() + 1000 * 60 * 15; // 15 minutes

//     user.resetToken = token;
//     user.resetTokenExpiry = tokenExpires;
//     await user.save();

//     const resetUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/reset-password?token=${token}`;

//     const sent = await sendPasswordResetEmail(email, resetUrl);

//     if (!sent) {
//       return NextResponse.json(
//         { error: "Error sending email" },
//         { status: 500 }
//       );
//     }

//     return NextResponse.json({ message: "Password reset email sent" });
//   } catch (error) {
//     console.error("Error:", error);
//     return NextResponse.json(
//       { error: "Server error" },
//       { status: 500 }
//     );
//   }
// }


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

    // prevent user enumeration
    if (!user) {
      return NextResponse.json({
        message: "If the email exists, a reset link has been sent",
      });
    }

    // generate reset token
    const token = crypto.randomBytes(32).toString("hex");

    const tokenExpires = Date.now() + 1000 * 60 * 15; // 15 minutes

    user.resetToken = token;
    user.resetTokenExpiry = tokenExpires;

    await user.save();

    // create reset link
    const resetUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/reset-password?token=${token}`;

    // send email
    const emailSent = await sendPasswordResetEmail(email, resetUrl);

    if (!emailSent) {
      return NextResponse.json(
        { error: "Failed to send reset email" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Password reset email sent successfully",
    });

  } catch (error) {
    console.error("Forgot password error:", error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}