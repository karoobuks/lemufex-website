import { NextResponse } from "next/server";
import connectedDB from "@/config/database";
import User from "@/models/User";
import bcrypt from 'bcryptjs';


export async function POST(req){
    try {
        await connectedDB()

        const {firstName, lastName, email, password, phone, role} = await req.json()

        if(!email || !password){
            return NextResponse.json({error:'email and password required'}, {status:400})
        }

        const existingUser = await User.findOne({email})

        if(existingUser){
            return NextResponse.json({error:'Email already exists'}, {status:409})
        }

        const hashedPassword = await bcrypt.hash(password, 12)

        const newUser = new User({
           firstName,
           lastName,
           email,
           password:hashedPassword,
           phone,
            
        })

        await newUser.save()
        return NextResponse.json({success:'User registered successfully'}, {status:201})

    } catch (error) {
       console.log('Something went wrong:', error)
       NextResponse.json({message:'An error occured'},{status:500}) 
    }
}