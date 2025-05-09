import mongoose from "mongoose"

const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    image: { type: String, required: false },
    likes: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["upcoming", "completed", "cancelled"],
      default: "upcoming",
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.Events || mongoose.model("Events", EventSchema)
