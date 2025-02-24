import mongoose from "mongoose"

const RequestSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    dontaionNumber: { type: Number, required: true },
    donationGoal: { type: Number, required: true },
    status: { type: String, enum: ["open", "closed"], default: "open" },
    donationReceived: { type: Number, default: 0 },
    image: { type: String, required: false },
    likes: {type: Number, default: 0},
})

export default mongoose.models.Request || mongoose.model("Request", RequestSchema)
