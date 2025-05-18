import mongoose from "mongoose"

const CommentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    content: { type: String, required: true },
  },
  {
    timestamps: true,
  }
)

const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    image: { type: String, required: true },
    volunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
    comments: [CommentSchema],
    status: {
      type: String,
      enum: ["upcoming", "completed", "cancelled"],
      default: "upcoming",
    },
    eventDate: { type: Number, required: true },
    eventAnalysis: {
      judgment: {
        type: String,
        enum: ["Trustworthy", "Needs Review", "Suspicious"],
      },
      reason: { type: String },
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.Events || mongoose.model("Events", EventSchema)
