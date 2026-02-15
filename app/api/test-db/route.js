import { NextResponse } from "next/server";
import connectedDB from "@/config/database";

export async function GET() {
  try {
    await connectedDB();
    return NextResponse.json({ 
      status: "success", 
      message: "MongoDB connection successful",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    return NextResponse.json({ 
      status: "error", 
      message: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}