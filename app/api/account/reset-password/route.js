// //app/api/account/reset-password/route.js
// import { NextResponse } from "next/server";
// import connectedDB from "@/config/database";
// import User from "@/models/User";
// import bcrypt from "bcryptjs"



// export async function POST(req) {
//   try {
//     await connectedDB()
//     const { token, password } = await req.json()

//     if (!token || !password) {
//       return NextResponse.json({ message: "Token and password are required" }, { status: 400 });
//     }

//     const hashed = await bcrypt.hash(password, 12)

//     // Find user by valid, unexpired token and update the password atomically
//     const user = await User.findOneAndUpdate(
//       {
//         resetToken: token,
//         resetTokenExpiry: { $gt: Date.now() },
//       },
//       {
//         $set: { password: hashed },
//         $unset: { resetToken: 1, resetTokenExpiry: 1 },
//       },
//       { new: true }
//     );

//     if (!user) {
//       return NextResponse.json({ message: 'Invalid or expired token' }, { status: 400 })
//     }

//     return NextResponse.json({ message: 'Password reset successful' }, { status: 200 })
//   } catch (error) {
//     console.error("Reset password error:", error);
//     return NextResponse.json(
//       { message: "Server error" },
//       { status: 500 }
//     );
//   }
// }

// app/api/account/reset-password/route.js

// import { NextResponse } from "next/server";
// import connectedDB from "@/config/database";
// import User from "@/models/User";
// import bcrypt from "bcryptjs";

// export async function POST(req) {
//   try {
//     await connectedDB();

//     const { token, password } = await req.json();

//     if (!token || !password) {
//       return NextResponse.json(
//         { message: "Token and password are required" },
//         { status: 400 }
//       );
//     }

//     // Find user with valid token
//     const user = await User.findOne({
//       resetToken: token,
//       resetTokenExpiry: { $gt: Date.now() },
//     });

//     if (!user) {
//       return NextResponse.json(
//         { message: "Invalid or expired token" },
//         { status: 400 }
//       );
//     }

//     // Hash new password
//     const hashedPassword = await bcrypt.hash(password, 12);

//     // Update password
//     user.password = hashedPassword;

//     // Remove reset token
//     user.resetToken = undefined;
//     user.resetTokenExpiry = undefined;

//     await user.save();

//     return NextResponse.json(
//       { message: "Password reset successful" },
//       { status: 200 }
//     );

//   } catch (error) {
//     console.error("Reset password error:", error);

//     return NextResponse.json(
//       { message: "Server error" },
//       { status: 500 }
//     );
//   }
// }

// app/api/account/reset-password/route.js

import { NextResponse } from "next/server";
import connectedDB from "@/config/database";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function POST(req) {
  try {
    await connectedDB();

    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { message: "Token and password are required" },
        { status: 400 }
      );
    }

    // hash token to match DB stored token
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // find user with valid token
    const user = await User.findOne({
      resetToken: hashedToken,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    // hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // update password
    user.password = hashedPassword;

    // remove reset token fields
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    return NextResponse.json(
      { message: "Password reset successful" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Reset password error:", error);

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}