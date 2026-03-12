import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectedDB from "@/config/database";
import Review from "@/models/Review";
import User from "@/models/User"; // Ensure User model is registered for population

/**
 * GET /api/reviews
 * Fetches all approved reviews for public display.
 */
export async function GET() {
  try {
    await connectedDB();

    // Fetch only reviews with the status 'approved'
    const reviews = await Review.find({ status: "approved" })
      .populate({
        path: "userId",
        model: User,
        select: "firstName lastName image", // Select only the fields you need for display
      })
      .sort({ createdAt: -1 }) // Show the newest reviews first
      .limit(10) // Optional: limit the number of reviews shown
      .lean();

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("API Error fetching approved reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/reviews
 * Allows authenticated users to submit a review.
 */
export async function POST(request) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectedDB();

    const { rating, comment, serviceType } = await request.json();

    const name = session.user.name || `${session.user.firstName} ${session.user.lastName}`;

    const newReview = await Review.create({
      user: session.user.id,
      name: (name && name !== "undefined undefined") ? name : "Anonymous", // Fallback if name is missing
      email: session.user.email,
      rating,
      comment,
      serviceType: serviceType || "general",
      status: "pending", // Reviews must be approved by admin
    });

    return NextResponse.json({ message: "Review submitted", review: newReview }, { status: 201 });
  } catch (error) {
    console.error("API Error submitting review:", error);
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 }
    );
  }
}