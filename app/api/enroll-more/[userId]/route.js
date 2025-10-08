import { NextResponse } from "next/server";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import User from "@/models/User";
import connectedDB from "@/config/database";
import Trainee from "@/models/Trainee";

export async function POST(req, {params}){
    try {
        await connectedDB()

        const session = await getServerSession(authOptions)
        if(!session?.user?.email){
            return NextResponse.json({error:'Unauthorized'}, {status:401})
        }

        const user = await User.findOne({email: session.user.email}).lean()
        if(!user){
            return NextResponse.json({error:'Unathourized'}, {status:401})
        }

        // const { id } = params
        const trainee = await Trainee.findOne({user: user._id})
        if(!trainee){
            return NextResponse.json({error:'Trainee Not Found'}, {status:401})
        }

        const body = await req.json()
        const { track} = body

        if(!track){
            return NextResponse.json({error:"Track is required"}, {status:400})
        }

        const normalizedTrack = track.toLowerCase();

        const alreadyEnrolled = trainee.trainings.some( (t) => t.track.toLowerCase() === normalizedTrack)

        if(alreadyEnrolled){
            return NextResponse.json({message:`Already enrolled in ${track}`}, {status:200});
        }

        trainee.trainings.push({track})
        await trainee.save();

        return NextResponse.json({message:`Successfully enrolled in ${track} `, trainee }, {status:200})

        
    } catch (error) {
       console.error("Enrollment error:", error)
       return NextResponse.json({error:"Something went wrong", details: error.message}, {status:500}); 
    }
}