import { NextResponse } from "next/server";
import Trainee from "@/models/Trainee";
import { getServerSession } from "next-auth";
import User from "@/models/User";
import connectedDB from "@/config/database";
import { authOptions } from "@/utils/authOptions";


export async function POST(req) {
    await connectedDB()
    const session = await getServerSession(authOptions)
    if(!session?.user?.email){
        return NextResponse.json({error:'Unauthorized'}, {status:401})
    }
    try {
    const {fullName, email, trainings, phone, address, dob, emergencycontact} = await req.json()
        // const user = await User.findOne({email:session.user.email })

         const user = await User.findOneAndUpdate(
    { email: session.user.email },
    { isTrainee: true },
    { new: true }
  );

        if(!user){
            return NextResponse.json({error:'User not found'}, {status:404})
        }

        const existingTrainee = await Trainee.findOne({user:user._id})

        if(existingTrainee){
          return  NextResponse.json({error:'Already registered as trainee'}, {status:400})
        }

          // Fix: Normalize trainings input
            let formattedTrainings = [];

            if (typeof trainings === "string") {
            formattedTrainings.push({ track: trainings });
            } else if (Array.isArray(trainings)) {
            formattedTrainings = trainings.map((track) =>
                typeof track === "string" ? { track } : track
            );
            }

        const newTrainee = await Trainee.create({
            user: user._id,
            fullName,
            email,
            trainings: formattedTrainings,
            phone,
            address,
            dob,
            emergencycontact,
        })

        user.isTrainee = true
        await user.save()

        return NextResponse.json({success:'Trainee successfully registered', trainee:newTrainee},{status:201})

    } catch (error) {
       console.log('An error occured,try again:', error)
       return NextResponse.json({error:'Registration failed, something went wrong'}, {status:500}) 
    }
}