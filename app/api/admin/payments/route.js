import { NextResponse } from "next/server";
import Payment from "@/models/Payment";
import User from "@/models/User";
import Course from "@/models/Course";
import connectedDB from "@/config/database";

export async function GET(req) {
    try {
        await connectedDB();

        // First get raw payments without population
        const rawPayments = await Payment.find().sort({ createdAt: -1 }).lean();
        console.log('Raw payments count:', rawPayments.length);
        console.log('Sample raw payment:', rawPayments[0]);
        
        // Then get populated payments
        const payments = await Payment.find()
            .populate("userId", "firstName lastName email")
            .populate("course", "name")
            .sort({ createdAt: -1 })
            .lean();
        
        console.log('Populated payments count:', payments.length);
        console.log('Sample populated payment:', payments[0]);
        
        // Check if userId exists in raw data
        if (rawPayments[0]) {
            console.log('Raw userId field:', rawPayments[0].userId);
            console.log('Raw email field:', rawPayments[0].email);
        }
        
        return NextResponse.json({
            success: true,
            payments,
            pagination: { page: 1, pages: 1, total: payments.length }
        }, { status: 200 });
    } catch (error) {
        console.error('Error fetching payments:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}