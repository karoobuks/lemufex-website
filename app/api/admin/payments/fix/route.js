import { NextResponse } from "next/server";
import Payment from "@/models/Payment";
import User from "@/models/User";
import connectedDB from "@/config/database";

export async function POST(req) {
    try {
        await connectedDB();

        // Find payments with null userId but have email
        const paymentsWithoutUserId = await Payment.find({
            $or: [
                { userId: null },
                { userId: { $exists: false } }
            ],
            email: { $exists: true, $ne: null }
        });

        console.log(`Found ${paymentsWithoutUserId.length} payments without userId`);

        let fixed = 0;
        let notFound = 0;

        for (const payment of paymentsWithoutUserId) {
            // Try to find user by email
            const user = await User.findOne({ email: payment.email });
            
            if (user) {
                await Payment.findByIdAndUpdate(payment._id, { userId: user._id });
                fixed++;
                console.log(`Fixed payment ${payment._id} - linked to user ${user._id}`);
            } else {
                notFound++;
                console.log(`No user found for email: ${payment.email}`);
            }
        }

        return NextResponse.json({
            success: true,
            message: `Fixed ${fixed} payments, ${notFound} emails not found`,
            fixed,
            notFound,
            total: paymentsWithoutUserId.length
        });

    } catch (error) {
        console.error('Error fixing payments:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}