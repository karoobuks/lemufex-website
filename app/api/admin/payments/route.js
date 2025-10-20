import { NextResponse } from "next/server";
import Payment from "@/models/Payment";
import User from "@/models/User";
import Course from "@/models/Course";
import connectedDB from "@/config/database";

export async function GET(req) {
    try {
        await connectedDB();

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page")) || 1;
        const search = searchParams.get("search") || "";
        const status = searchParams.get("status") || "all";

        const limit = 10;
        const skip = (page - 1) * limit;

        // Build query
        let query = {};
        
        // Status filter
        if (status !== "all") {
            query.status = status;
        }
        
        // Search filter
        if (search) {
            const users = await User.find({
                $or: [
                    { firstName: { $regex: search, $options: "i" } },
                    { lastName: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } }
                ]
            }).select('_id');
            
            const courses = await Course.find({
                name: { $regex: search, $options: "i" }
            }).select('_id');
            
            query.$or = [
                { userId: { $in: users.map(u => u._id) } },
                { course: { $in: courses.map(c => c._id) } },
                { email: { $regex: search, $options: "i" } }
            ];
        }
        
        const [payments, total] = await Promise.all([
            Payment.find(query)
                .populate("userId", "firstName lastName email")
                .populate("course", "name")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Payment.countDocuments(query)
        ]);
        
        return NextResponse.json({
            success: true,
            payments,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            }
        }, { status: 200 });
    } catch (error) {
        console.error('Error fetching payments:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}