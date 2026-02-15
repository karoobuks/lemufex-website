import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("❌ MONGODB_URI not defined in environment variables");
}
const dns = require("dns");
// Force use of Google DNS
dns.setServers(["1.1.1.1", "8.8.8.8"]);


// Prevent strictQuery warning
mongoose.set("strictQuery", true);

// Global cache (important for Next.js hot reload)
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectedDB() {
  // Reuse existing connection
  if (cached.conn) {
    return cached.conn;
  }

  // Create connection once
  if (!cached.promise) {
    const options = {
      serverSelectionTimeoutMS: 10000, // give Atlas time
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, options)
      .then((mongooseInstance) => {
        console.log("✅ MongoDB Connected Successfully");
        return mongooseInstance;
      })
      .catch((err) => {
        cached.promise = null;
        console.error("❌ MongoDB Connection Error:", err.message);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectedDB;
