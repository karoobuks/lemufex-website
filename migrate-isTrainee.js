import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js"; // adjust the path if needed

dotenv.config();

async function migrate() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to DB");

    // Step 1: Fix string "true"/"false" to real booleans
    const result1 = await User.updateMany(
      { isTrainee: "true" },
      { $set: { isTrainee: true } }
    );

    const result2 = await User.updateMany(
      { isTrainee: "false" },
      { $set: { isTrainee: false } }
    );

    // Step 2: Fix null or undefined → set to false
    const result3 = await User.updateMany(
      { isTrainee: { $exists: false } },
      { $set: { isTrainee: false } }
    );

    console.log("🔄 Migration complete:");
    console.log(`  - Converted "true" → true: ${result1.modifiedCount}`);
    console.log(`  - Converted "false" → false: ${result2.modifiedCount}`);
    console.log(`  - Added false where missing: ${result3.modifiedCount}`);

    await mongoose.disconnect();
    console.log("🚀 Done!");
  } catch (err) {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  }
}

migrate();
