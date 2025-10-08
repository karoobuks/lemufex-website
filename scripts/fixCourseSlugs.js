// scripts/fixCourseSlugs.js
import mongoose from "mongoose";
import connectedDB from "../config/database.js";
import Course from "../models/Course.js";

// Simple slugify util
function toSlug(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

async function run() {
  try {
    await connectedDB();

    const courses = await Course.find({});
    console.log(`🔍 Found ${courses.length} courses in DB`);

    for (const course of courses) {
      const expectedSlug = toSlug(course.name);

      if (!course.slug || course.slug !== expectedSlug) {
        console.log(
          `⚠️  Fixing slug for "${course.name}" (old: ${course.slug || "null"} → new: ${expectedSlug})`
        );
        course.slug = expectedSlug;
        await course.save();
      }
    }

    console.log("✅ Migration complete. All slugs fixed!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  }
}

run();
