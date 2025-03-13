import mongoose from "mongoose"

const RequestSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    donationNumber: { type: Number, required: true, default: 0 },
    donationGoal: { type: Number, required: true },
    status: { type: String, enum: ["open", "closed"], default: "open" },
    donationReceived: { type: Number, default: 0 },
    image: { type: String, required: false, default: "" },
    likes: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.Requests ||
  mongoose.model("Requests", RequestSchema)
