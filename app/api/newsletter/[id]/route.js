import { NextResponse } from "next/server";
import connectedDB from "@/config/database";
import Newsletter from "@/models/Newsletter";

// Toggle status (Active <-> Unsubscribed)
export async function PATCH(req, { params }) {
  try {
    await connectedDB();
    const { id } = params;
    const subscriber = await Newsletter.findById(id);

    if (!subscriber) {
      return NextResponse.json({ message: "Subscriber not found" }, { status: 404 });
    }

    subscriber.status =
      subscriber.status === "active" ? "unsubscribed" : "active";
    subscriber.unsubscribedAt =
      subscriber.status === "unsubscribed" ? new Date() : null;

    await subscriber.save();
    return NextResponse.json({ message: "Status updated", subscriber });
  } catch (error) {
    console.error("Toggle error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// Delete subscriber
export async function DELETE(req, { params }) {
  try {
    await connectedDB();
    const { id } = params;
    const subscriber = await Newsletter.findByIdAndDelete(id);

    if (!subscriber) {
      return NextResponse.json({ message: "Subscriber not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Subscriber deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
