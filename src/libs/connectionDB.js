import mongoose from "mongoose"

let isConnected = false

const connectionDB = async () => {
  if (isConnected) {
    console.log("Using existing connection")
    return mongoose.connection
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI)
    isConnected = db.connections[0].readyState
    console.log("New connection")
    return db
  } catch (err) {
    console.log(err)
  }
}

export default connectionDB
