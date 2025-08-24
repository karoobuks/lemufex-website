import connectedDB from "@/config/database";
import Trainee from "@/models/Trainee";
import { NextResponse } from "next/server";

export async function GET(req,{params}){
    await connectedDB()
    const {userId} = params;
    try {
        const trainee = await Trainee.findOne({user: userId}).populate('user')
        
        if(!trainee){
            return NextResponse.json({error:'Trainee not found'},{status:404})
        }
        return NextResponse.json({success:true, data:trainee},{status:200})
    } catch (error) {
        console.error('Error fetching trainee:', error)
        return NextResponse.json({error:'Internal server error'},{status:500})
    }
}