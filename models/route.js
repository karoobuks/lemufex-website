import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectedDB from "@/config/database";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
    await connectedDB();
    const session = await auth();

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { currentPassword, newPassword } = await req.json();

        if (!currentPassword || !newPassword) {
            return NextResponse.json(
                { error: "Current and new passwords are required" },
                { status: 400 }
            );
        }

        if (newPassword.length < 6) {
            return NextResponse.json(
                { error: "New password must be at least 6 characters long" },
                { status: 400 }
            );
        }

        const user = await User.findById(session.user.id);

        if (!user || !user.password) {
            return NextResponse.json(
                { error: "User not found or not using password authentication." },
                { status: 404 }
            );
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            return NextResponse.json({ error: "Invalid current password" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password and increment sessionVersion to invalidate old sessions
        user.password = hashedPassword;
        user.sessionVersion = (user.sessionVersion || 0) + 1;
        await user.save();

        return NextResponse.json(
            { message: "Password updated successfully. All other sessions have been logged out." },
            { status: 200 }
        );
    } catch (error) {
        console.error("❌ Change password error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}