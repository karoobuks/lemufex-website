import { NextResponse } from "next/server";
import Course from "@/models/Course";
import connectedDB from "@/config/database";


export async function GET(){
    try {
        await connectedDB()
        const courses = await Course.find().lean()
        return NextResponse.json({courses})
    } catch (error) {
      console.error("Error fetching courses:",error)
      return NextResponse.json({error:"Failed to fetch courses"}, {status:500})  
    }
}