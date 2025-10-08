import connectedDB from "@/config/database";
import Resource from "@/models/Resource";
import { NextResponse } from "next/server";
import cloudinary from "@/config/cloudinary";
import { Readable } from "stream";
import Trainee from "@/models/Trainee";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import Course from "@/models/Course";
import { v2 } from "cloudinary";
import path from "path";

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if(!session){
      return NextResponse.json({error:"Unauthorized"}, {status:401})
    }

    const trainee = await Trainee.findOne({ user: session.user.id})

    if (!trainee) {
  console.error("No trainee found for session id:", session?.user?.id)
  return NextResponse.json({ error: "Trainee not found" }, { status: 404 })
}

    let resources;

    if(session.user.role === "admin"){
      resources = await Resource.find().sort({ createdAt: -1});

      return NextResponse.json(resources)
    } else{
      const enrolledTracks = trainee.trainings.map((t) => t.track);
      resources = await Resource.find({ track: { $in:enrolledTracks }}).sort({ createdAt: -1});
      return NextResponse.json(resources)
    }
  } catch (error) {
    console.error("Error fetching resources:", error)
    return NextResponse.json({error:"Failed to fetch resources"}, {status:500})
  }
}

export const runtime = "nodejs"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    await connectedDB()
    const formData = await req.formData()
    const file = formData.get("file")
    const title = formData.get("title")
    const description = formData.get("description")
    const track = formData.get("track")
    
    if(!file){
      return NextResponse.json({error:"No file uploaded"}, {status:400})
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "raw", folder: "Lemufex-website/resources"},
        ( error, result) =>{
          if(error) reject(error)
            else resolve(result)
        }
      );
      Readable.from(buffer).pipe(uploadStream)
    })

    const originalUrl = uploadResult.secure_url;
    const safeTitle = title?.replace(/\s+/g, "_") || "resource"; // filename-friendly

    const ext = path.extname(uploadResult.secure_url) || ".pdf";
 
    const downloadUrl =
    uploadResult.secure_url.includes("?")
      ? `${uploadResult.secure_url}&fl_attachment=${safeTitle}.pdf`
      : `${uploadResult.secure_url}?fl_attachment=${safeTitle}.pdf`;


    const resource = await Resource.create({
      title,
      description,
      fileUrl: downloadUrl,
      track,
    })

    const course = await Course.findOne({name: track});
    if(course){
      course.modules.push({
        title,
        description,
        order: course.modules.length +1
      })

      // course.totalModules = course.modules.length
      await course.save()
    }
    
    return NextResponse.json({ success:true, resource}, {status:201})

  } catch (error) {
    console.error('resource save error:', error)
    return NextResponse.json({success:false, error}, {status:500})
  }
}
