import mongoose from "mongoose"

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true  },
  image: { type: String, required: false },
  likes: { type: Number, default: 0 },
  status: { type: String, enum: ["upcoming", "completed", "cancelled"], default: "upcoming" },
})

export default mongoose.models.Events || mongoose.model("Events", EventSchema)
