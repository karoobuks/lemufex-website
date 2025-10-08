
// app/api/resources/[track]/route.js
import { NextResponse } from "next/server";
import connectedDB from "@/config/database";
import Resource from "@/models/Resource";
import { reverseSlugify } from "@/utils/slugify";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import User from "@/models/User";
import Trainee from "@/models/Trainee";



export async function GET(req, { params }) {
  await connectedDB();

  const session = await getServerSession(authOptions);

  if(!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized"}, { status: 401});
  }

  const user = await User.findOne({ email: session.user.email}).lean();
  if(!user){
    return NextResponse.json({ error: "Unauthorized"}, { status:401})
  }

  const { track } = params;
  const realTrack = reverseSlugify(track); // slug → readable name
  const normalizedRealTrack = realTrack.toLowerCase()

  if( user.role !== "admin") {
    const trainee = await Trainee.findOne({ user: user._id}).lean();
    const allowedTracks = trainee?.trainings?.map((t) => t.track.toLowerCase()) || [];

    if(!allowedTracks.includes(normalizedRealTrack)) {
      return NextResponse.json(
        { error: `You are not enrolled in ${realTrack}`},
        { status:403 }
      );
    }
  }

  // case-insensitive query
  const resources = await Resource.find({
    track: { $regex: `^${normalizedRealTrack}$`, $options: "i" }
  }).lean();

  if (!resources.length) {
    return NextResponse.json(
      { message: `No resources found for ${realTrack}` },
      { status: 404 }
    );
  }

  // force-download Cloudinary URLs
  const transformedResources = resources.map((res) => {
    let url = res.fileUrl;
    if (url && !url.includes("fl_attachment")) {
      const safeTitle = res.title?.replace(/\s+/g, "_") || "resource";
      url = url.replace("/upload/", `/upload/fl_attachment:${safeTitle}/`);
    }
    return { ...res, fileUrl: url };
  });

  return NextResponse.json({ resources: transformedResources });
}
