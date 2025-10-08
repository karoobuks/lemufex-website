// scripts/fixCourses.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Course from "../models/Course.js"; // adjust if path differs

dotenv.config();

// --- util to slugify ---
function toSlug(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const courses = await Course.find();
    console.log(`Found ${courses.length} courses.`);

    for (let course of courses) {
      let updated = false;

      // --- Fix slug ---
      const correctSlug = toSlug(course.name);
      if (course.slug !== correctSlug) {
        console.log(`Fixing slug: "${course.slug}" → "${correctSlug}"`);
        course.slug = correctSlug;
        updated = true;
      }

      // --- Ensure prices field exists ---
      if (!course.prices || !course.prices.full || !course.prices.installment) {
        console.log(`Backfilling prices for course: ${course.name}`);
        course.prices = {
          full: course.prices?.full || 0,
          installment: course.prices?.installment || 0,
        };
        updated = true;
      }

      if (updated) {
        await course.save();
        console.log(`✅ Updated: ${course.name}`);
      }
    }

    console.log("🎉 Migration complete.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  }
}

run();
