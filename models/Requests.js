import mongoose from "mongoose"

const RequestSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    donationNumber: { type: Number, required: true, default: 0 },
    donationGoal: { type: Number, required: true },
    status: {
      type: String,
      enum: ["active", "fulfilled", "urgent"],
      default: "active",
    },
    donationReceived: { type: Number, default: 0 },
    image: { type: String, default: "" },

    trustAnalysis: {
      summary: { type: String },
      judgment: {
        type: String,
        enum: ["Trustworthy", "Needs Review", "Suspicious"],
      },
      reason: { type: String },
    },
  },
  { timestamps: true }
)

export default mongoose.models.Requests ||
  mongoose.model("Requests", RequestSchema)
