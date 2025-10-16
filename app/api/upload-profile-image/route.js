import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import connectedDB from '@/config/database';
import Trainee from '@/models/Trainee';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    await connectedDB();

    const formData = await request.formData();
    const image = formData.get('image');
    const userId = formData.get('userId');

    if (!image || !userId) {
      return NextResponse.json(
        { error: 'Image and userId are required' },
        { status: 400 }
      );
    }

    // Convert image to buffer
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const uploadResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: 'Lemufex-website/profiles',
          transformation: [
            { width: 400, height: 400, crop: 'fill', gravity: 'face' },
            { quality: 'auto', fetch_format: 'auto' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    // Update trainee record with new image URL
    const updatedTrainee = await Trainee.findOneAndUpdate(
      { userId },
      { image: uploadResponse.secure_url },
      { new: true }
    );

    if (!updatedTrainee) {
      return NextResponse.json(
        { error: 'Trainee not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Profile image updated successfully',
      imageUrl: uploadResponse.secure_url,
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}