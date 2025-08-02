import { NextResponse } from "next/server"
import connectedDB from "@/config/database"
import RequestQuote from "@/models/RequestQuote"
import { v2 } from "cloudinary"
import cloudinary from "@/config/cloudinary";
import mongoose from "mongoose";


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


export async function POST(req){
    try {
        await connectedDB()
        const data = await req.formData()

        const name = data.get('name')
        const email = data.get('email')
        const phone = data.get('phone')
        const service = data.get('service')
        const options = data.get('options')
        const message = data.get('message')
        const file = data.get('file')

          if (!mongoose.Types.ObjectId.isValid(service)) {
      return NextResponse.json({ success: false, error: "Invalid service ID" }, { status: 400 });
    }

        let imageUrl = '';
        
          if (file && typeof file === "object" && file.type.startsWith("image/")) {
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { success: false, error: "File size exceeds 5MB." },
          { status: 400 }
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const upload = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ resource_type: "image", folder:'Lemufex-website' }, (err, result) => {
            if (err) return reject(err);
            resolve(result);
          })
          .end(buffer);
      });
            imageUrl = upload.secure_url;
        }

        const newQuote = await RequestQuote.create({
            name,
            email,
            phone,
            message,
            service: new mongoose.Types.ObjectId(service),
            options,
            image : imageUrl,
        })

         console.log({ name, email, phone, service, options, message });
        return NextResponse.json({ success: true, data: newQuote }, { status: 201 });

        

    } catch (error) {
        console.error('Request quote error:', error)
        return NextResponse.json({success:false, error:error.message}, {status:500})
    }
}