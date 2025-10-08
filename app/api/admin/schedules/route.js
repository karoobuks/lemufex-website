import { NextResponse } from "next/server";
import connectedDB from "@/config/database";
import Schedule from "@/models/Schedule";
import cloudinary from "@/config/cloudinary";
import { requireAdmin } from "@/utils/requireAdmin";

export const dynamic = "force-dynamic";

export async function GET() {
  const guard = await requireAdmin();
  if (!guard.ok) {
    return NextResponse.json({ error: guard.reason }, { status: guard.reason === "FORBIDDEN" ? 403 : 401 });
  }

  await connectedDB();
  const items = await Schedule.find().sort({ versionNumber: -1 }).lean();
  return NextResponse.json({ success: true, data: items });
}

export async function POST(req) {
  const guard = await requireAdmin();
  if (!guard.ok) {
    return NextResponse.json({ error: guard.reason }, { status: guard.reason === "FORBIDDEN" ? 403 : 401 });
  }

  await connectedDB();

  const formData = await req.formData();
  const title = formData.get("title");
  const file = formData.get("file"); // PDF

  if (!title || !file) {
    return NextResponse.json({ error: "Title and file are required" }, { status: 400 });
  }

  // Convert file to buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Upload to Cloudinary as raw (pdf)
  const upload = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { resource_type: "raw", folder: "Lemufex-website/schedules", public_id: undefined },
        (err, result) => (err ? reject(err) : resolve(result))
      )
      .end(buffer);
  });

  const doc = await Schedule.create({
    title,
    fileUrl: upload.secure_url,
    uploadedBy: guard.session.user.id,
  });

  return NextResponse.json({ success: true, data: doc }, { status: 201 });
}
