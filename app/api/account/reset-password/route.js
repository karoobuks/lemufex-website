import { NextResponse } from "next/server";
import connectedDB from "@/config/database";
import User from "@/models/User";
import bcrypt from "bcryptjs"



export async function POST(req){
    try{
      await connectedDB()
    const {userId, password} = await req.json()
    console.log("Received userId:", userId);
    console.log("Received body:", { userId, password });

    const user = await User.findById(userId)

     if (!userId || !password) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    if(!user){
       return NextResponse.json({message:'User not found'}, {status:400})
    }

    const hashed = await bcrypt.hash(password, 12)
    user.password = hashed;
    

    await user.save()

   return NextResponse.json({message:'Password reset successful'},{status:200})
} catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}