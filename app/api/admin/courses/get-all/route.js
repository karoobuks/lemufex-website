import { NextResponse } from "next/server";
import connectedDB from "@/config/database";
import Course from "@/models/Course";


export  async function GET(){
    try {
        await connectedDB()

        const courses = await Course.find({}, "name slug prices")

        console.log("📊 Courses from DB:", JSON.stringify(courses, null, 2));

        return NextResponse.json({ courses}, {status:200}) 
    } catch (error) {
            console.error("❌ Error fetching courses:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}