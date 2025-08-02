import User from "@/models/User";
import { NextResponse } from "next/server";
import { serialize } from "cookie";
import connectedDB from "@/config/database";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { headers } from "next/headers";

export async function POST(req){
    try {
        await connectedDB()

        const {email, password} = await req.json()
        const user = await User.findOne({email})

        if(!user){
            return NextResponse.json({error:'User Not Found'}, {status:404})
        }

         const isMatchedPassword = await bcrypt.compare(password, user.password)
        if(!isMatchedPassword){
            return NextResponse.json({error:'Invalid password or email'}, {status:401})
        }

        const token = jwt.sign({_id:user._id, email:user.email, role:user.role}, process.env.JWT_SECRET, { expiresIn:process.env.JWT_EXPIRES_IN } )

        const cookie = serialize('token', token, {
            httpOnly:true,
            secure:process.env.NODE_ENV === 'production',
            sameSite:'lax',
            path:'/',
            maxAge: 60 * 60 * 24 * 7
        })
        
        console.log(user)
        
    const response = NextResponse.json(
      { success: "User successfully logged in" },
      { status: 200 }
    );
    response.headers.set("Set-Cookie", cookie);
    return response;
       

        //return NextResponse.json({success:'User successfully logged in'}, {status:200},{headers:{'Set-Cookie':cookie, 'Content-Type':'application/json'}})
    } catch (error) {
      console.log('Something went wrong:',error)
      return NextResponse.json({message:'An error occured'}, {status:500})  
    }
}

