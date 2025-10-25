// import mongoose from "mongoose";

// const MONGODB_URI = process.env.MONGODB_URI;

// if (!MONGODB_URI) {
//   throw new Error("❌ MONGODB_URI not defined in environment variables");
// }

// let cached = global.mongoose || { conn: null, promise: null };

// async function connectedDB() {
//   mongoose.set("strictQuery", true);

//   if (cached.conn) {
//     return cached.conn;
//   }

//   if (!cached.promise) {
//     cached.promise = mongoose.connect(MONGODB_URI, {
//       serverSelectionTimeoutMS: 30000,
//       socketTimeoutMS: 45000,
//       maxPoolSize: 50,
//       minPoolSize: 5,
//       maxIdleTimeMS: 30000,
//       retryWrites: true,
//       w: 'majority'
//     }).then((mongoose) => {
//       console.log("✅ MongoDB Connected Successfully");
//       return mongoose;
//     }).catch((err) => {
//       console.error("❌ MongoDB Connection Error:", err.message);
//       throw err;
//     });
//   }

//   cached.conn = await cached.promise;
//   global.mongoose = cached;

//   return cached.conn;
// }

// export default connectedDB;

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("❌ MONGODB_URI not defined in environment variables");
}

// Global cached connection for serverless environments
let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

async function connectedDB(retries = 5, delay = 2000) {
  mongoose.set("strictQuery", true);

  // Return cached connection if available
  if (cached.conn) return cached.conn;

  // If a connection is already in progress, wait for it
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10, // safe for serverless
        minPoolSize: 1,
        retryWrites: true,
        w: "majority",
      })
      .then((mongoose) => {
        console.log("✅ MongoDB Connected Successfully");
        return mongoose;
      })
      .catch(async (err) => {
        console.error("❌ MongoDB Connection Error:", err.message);
        if (retries > 0) {
          console.log(`⏳ Retrying MongoDB connection in ${delay}ms... (${retries} retries left)`);
          await new Promise((res) => setTimeout(res, delay));
          return connectedDB(retries - 1, delay);
        }
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectedDB;
