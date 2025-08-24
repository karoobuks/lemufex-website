// import { Resend } from "resend";
// import crypto from "crypto"
// import connectedDB from "@/config/database";
// import User from "@/models/User";
// import { NextResponse } from "next/server";

// const resend = new Resend(process.env.RESEND_API_KEY);

// export default async function handler(req, res){
//     if(req.method !== 'POST'){
//         return NextResponse.json({error:'Method not allowed'}, {status:405})
//     }

//     const { email } = req.body
//     await connectedDB()

//     const user = await User.findOne({email})
//     if(!user){
//         return NextResponse.json({error:'User not Found'}, {status:400})
//     }

//     const token = crypto.randomBytes(32).toString("hex");
//     const tokenExpires = Date.now() + 1000 * 60 * 15

//     user.resetToken = token
//     user.resetTokenExpiry = tokenExpires
//     await user.save()
    
//     const resetUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/reset-password?token=${resetToken}`;

//       try {
//     await resend.emails.send({
//       from: "onboarding@resend.dev",                              //"no-reply@yourdomain.com", // must be verified on Resend
//       to: email,
//       subject: "Password Reset Request",
//       html: `
//         <p>Hello,</p>
//         <p>You requested to reset your password. Click the link below:</p>
//         <a href="${resetUrl}" target="_blank">${resetUrl}</a>
//         <p>This link expires in 15 minutes.</p>
//       `,
//     });
//        return res.status(200).json({ message: "Password reset email sent" });
//   } catch (error) {
//     console.error("Resend error:", error);
//     return res.status(500).json({ error: "Error sending email" });
//   }
// }



// app/api/auth/forgot-password/route.js
import crypto from "crypto";
import connectedDB from "@/config/database";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { sendPasswordResetEmail } from "@/utils/mailer";

export async function POST(req) {
  try {
    const { email } = await req.json();

    await connectedDB();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const tokenExpires = Date.now() + 1000 * 60 * 15; // 15 minutes

    user.resetToken = token;
    user.resetTokenExpiry = tokenExpires;
    await user.save();

    const resetUrl = `${process.env.NEXT_PUBLIC_DOMAIN}/reset-password?token=${token}`;

    const sent = await sendPasswordResetEmail(email, resetUrl);

    if (!sent) {
      return NextResponse.json(
        { error: "Error sending email" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
