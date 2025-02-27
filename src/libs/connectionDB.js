import mongoose from "mongoose"

let isConnected = false

export default async function connectionDB() {
  if (isConnected) {
    console.log("Using existing database connection.")
    return mongoose.connection
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URL)

    isConnected = db.connections[0].readyState === 1
    console.log("✅ MongoDB connected successfully.")
    return db
  } catch (error) {
    console.error("MongoDB connection error:", error)
  }
}
