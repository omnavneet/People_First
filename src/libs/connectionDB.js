import mongoose from "mongoose"

let isConnected = false

const connectionDB = async () => {
  if (isConnected) {
    console.log("Using existing connection")
    return
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI)
    isConnected = db.connections[0].readyState
    console.log("New connection")
    return db
  } catch (err) {
    console.log(err)
  }
}

export default connectionDB
