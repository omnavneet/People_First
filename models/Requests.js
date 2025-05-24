import mongoose from "mongoose"

const DonationSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

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
    donors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
    donations: [DonationSchema],
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
