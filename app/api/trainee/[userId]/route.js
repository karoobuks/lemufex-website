import connectedDB from "@/config/database";
import Trainee from "@/models/Trainee";
import { NextResponse } from "next/server";

export async function GET(req,{params}){
    await connectedDB()
    const {userId} = await params;
    try {
        const trainee = await Trainee.findOne({user: userId}).populate("trainings.course", "name totalModules")
        
        if(!trainee){
            return NextResponse.json({error:'Trainee not found'},{status:404})
        }
        // return NextResponse.json({success:true, data:trainee},{status:200})

        return NextResponse.json({success:true, data:trainee},{
            trainings: trainee.trainings.map((t) =>({
                courseName: t.course?.name,
                totalModules: t.course?.totalModules || 0,
                completeModules: t.completeModules || 0,
            }))
        })
    } catch (error) {
        console.error('Error fetching trainee:', error)
        return NextResponse.json({error:'Internal server error'},{status:500})
    }
}