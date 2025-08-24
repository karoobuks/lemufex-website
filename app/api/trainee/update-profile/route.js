import { NextResponse } from "next/server";
import connectedDB from "@/config/database";
import Trainee from "@/models/Trainee";
import { cookies } from "next/headers";
import { getSessionUser } from "@/utils/getSessionUser";
import cloudinary from "@/config/cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  api_key: process.env.CLOUDINARY_API_KEY,
});

export const dynamic = 'force-dynamic';

export async function POST(req){
  console.log('Hit the ground running🔥')
   
  try {
    
    await connectedDB();
    
    const {user, trainee} = await getSessionUser(true);
    console.log('trainee:', trainee)
    if (!user || !user._id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if(!trainee){
      return NextResponse.json({ error:'Trainee not found'}, { status:404})
    }

    const data = await req.formData()

    const fullName = data.get('fullName');
    const phone = data.get('phone');
    const emergencycontact = data.get('emergencycontact');
    const address = data.get('address');
    const dob = data.get('dob');
    const image = data.get('image');

    console.log({
      fullName,
      phone,
      emergencycontact,
      address,
      dob,
    });

    let imageUrl = null;

    if (image && typeof image === 'object') {
      const buffer = Buffer.from(await image.arrayBuffer());
      const base64Image = `data:${image.type};base64,${buffer.toString('base64')}`;

      try {
        const result = await cloudinary.uploader.upload(base64Image, {
          folder: 'Lemufex-website/profiles',
          resource_type: 'image',
          timeout: 60000,
        });

        console.log('✅ Image uploaded:', result);
        imageUrl = result.secure_url;
      } catch (uploadErr) {
        console.error('❌ Cloudinary upload failed:', uploadErr);
        return NextResponse.json({ error: 'Image upload failed', details: uploadErr.message }, { status: 500 });
      }
    }

    const updateFields =  {
      fullName,
      phone,
      address,
      emergencycontact,
      dob: dob ? new Date(dob) : undefined,
    };

    if (imageUrl) {
      updateFields.image = imageUrl;
    }

    console.log('📦 Updating trainee with ID:', trainee._id);

    const updatedTraineeProfile = await Trainee.findByIdAndUpdate(
      trainee._id,
      updateFields,
      { new: true, runValidators: true }
    );

    console.log('✅ Updated trainee:', updatedTraineeProfile);

    return NextResponse.json({ success: true, data: updatedTraineeProfile }, { status: 200 });

  } catch (error) {
    console.error('❌ Failed to update trainee profile:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
