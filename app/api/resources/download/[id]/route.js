//app/api/resources/[id]/route.js
import { NextResponse } from "next/server";
import connectedDB from "@/config/database";
import Resource from "@/models/Resource";
import User from "@/models/User";
import Trainee from "@/models/Trainee";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import cloudinary from "@/config/cloudinary";


export async function GET(req, { params }) {
  

  try {
    await connectedDB();

    const session = await getServerSession(authOptions);
    if(!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized"}, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email}).lean();
    if(!user){
      return NextResponse.json({ error: "Unauthorized"}, { status: 401})
    }

    const { id } = params;
    const resource = await Resource.findById(id).lean();

    if (!resource) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 }
      );
    }

    if(user.role !== "admin") {
      const trainee = await Trainee.findOne({ user: user._id}).lean();
      const allowedTracks = trainee?.trainings?.map((t) => t.track) || [];

      if(!allowedTracks.includes(resource.track)) {
        return NextResponse.json(
          { error: `You are not enrolled in ${resource.track}`},
          { status: 403}
        );
      }
    }

    // This should be the Cloudinary URL you stored in fileUrl
    const fileUrl = resource.fileUrl;

    // Instead of sending back the raw text, we fetch the file as a stream
    const response = await fetch(fileUrl);

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch file from Cloudinary" },
        { status: 500 }
      );
    }

    // Stream the response back to the client with proper headers
    const headers = new Headers();
    headers.set("Content-Type", "application/pdf");
    headers.set(
      "Content-Disposition",
      `attachment; filename="${resource.title || "download"}.pdf"`
    );

    return new Response(response.body, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Error fetching resource:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

