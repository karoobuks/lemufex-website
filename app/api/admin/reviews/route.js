// import { NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth/next';
// import connectedDB from '@/config/database';
// import Review from '@/models/Review';
// import User from '@/models/User'; // Import User model to ensure it's registered for populate
// import { authOptions } from '../../auth/[...nextauth]/route'; // Adjust this path if your authOptions is elsewhere

// /**
//  * @param {Request} request
//  */
// export async function GET(request) {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user?.role !== 'admin') {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//   }

//   try {
//     await connectedDB();

//     const reviews = await Review.find({})
//       .populate({
//         path: 'user',
//         model: User, // Explicitly provide model for robustness
//         select: 'name email image', // Select only the fields you need
//       })
//       .sort({ createdAt: -1 })
//       .lean(); // Use .lean() for faster, read-only queries

//     return NextResponse.json({ reviews });
//   } catch (error) {
//     console.error('API Error fetching reviews:', error);
//     return NextResponse.json({ error: 'Failed to fetch reviews.', details: error.message }, { status: 500 });
//   }
// }

// /**
//  * @param {Request} request
//  */
// export async function PUT(request) {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user?.role !== 'admin') {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//   }

//   try {
//     const { reviewId, status } = await request.json();

//     if (!reviewId || !status) {
//       return NextResponse.json({ error: 'Missing reviewId or status' }, { status: 400 });
//     }

//     if (!['approved', 'rejected', 'pending'].includes(status)) {
//       return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
//     }

//     await connectedDB();

//     const updatedReview = await Review.findByIdAndUpdate(
//       reviewId,
//       { status },
//       { new: true }
//     );

//     if (!updatedReview) {
//       return NextResponse.json({ error: 'Review not found' }, { status: 404 });
//     }

//     return NextResponse.json({ message: 'Review status updated', review: updatedReview });
//   } catch (error) {
//     console.error('API Error updating review:', error);
//     return NextResponse.json({ error: 'Failed to update review.', details: error.message }, { status: 500 });
//   }
// }

// /**
//  * @param {Request} request
//  */
// export async function DELETE(request) {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user?.role !== 'admin') {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//   }

//   try {
//     const { searchParams } = new URL(request.url);
//     const reviewId = searchParams.get('id');

//     if (!reviewId) {
//       return NextResponse.json({ error: 'Missing review ID' }, { status: 400 });
//     }

//     await connectedDB();

//     const deletedReview = await Review.findByIdAndDelete(reviewId);

//     if (!deletedReview) {
//       return NextResponse.json({ error: 'Review not found' }, { status: 404 });
//     }

//     return NextResponse.json({ message: 'Review deleted successfully' });
//   } catch (error) {
//     console.error('API Error deleting review:', error);
//     return NextResponse.json({ error: 'Failed to delete review.', details: error.message }, { status: 500 });
//   }
// }


import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectedDB from "@/config/database";
import Review from "@/models/Review";
import User from "@/models/User";

export async function GET() {
  const session = await auth();

  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectedDB();

    const reviews = await Review.find({})
      .populate({
        path: "user",
        model: User,
        select: "firstName lastName email image",
      })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("API Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews", details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  const session = await auth();

  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { reviewId, status } = await request.json();

    if (!reviewId || !status) {
      return NextResponse.json(
        { error: "Missing reviewId or status" },
        { status: 400 }
      );
    }

    if (!["approved", "rejected", "pending"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    await connectedDB();

    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { status },
      { new: true }
    );

    if (!updatedReview) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Review status updated",
      review: updatedReview,
    });
  } catch (error) {
    console.error("API Error updating review:", error);
    return NextResponse.json(
      { error: "Failed to update review", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  const session = await auth();

  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const reviewId = searchParams.get("id");

    if (!reviewId) {
      return NextResponse.json(
        { error: "Missing review ID" },
        { status: 400 }
      );
    }

    await connectedDB();

    const deletedReview = await Review.findByIdAndDelete(reviewId);

    if (!deletedReview) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("API Error deleting review:", error);
    return NextResponse.json(
      { error: "Failed to delete review", details: error.message },
      { status: 500 }
    );
  }
}