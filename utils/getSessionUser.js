import { getServerSession } from "next-auth";
import { authOptions } from "./authOptions";
import jwt from 'jsonwebtoken'
import { cookies } from "next/headers";
import connectedDB from "@/config/database";
import User from "@/models/User";

export async function getSessionUser(){
    await connectedDB()

    const session = await getServerSession(authOptions);
    if(session?.user?.email){
        const user = await User.findOne({email: session.user.email}).lean();
        return user;
    }
    
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value;
    if(!token) return null;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).lean();
        return user;
    } catch (error) {
         console.error('❌ Invalid token in getSessionUser:', error);
    return null;
    }
}