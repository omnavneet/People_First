import { NextResponse } from "next/server"
import Requests from "../../../../../../models/Requests"
import connectionDB from "../../../../../libs/connectionDB"
import mongoose from "mongoose"

export async function POST(req, { params }) {
  await connectionDB()
  const { id } = params

  try {
    const { amount, donorId, paymentIntentId } = await req.json()

    // Basic validation
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid donation amount" }, { status: 400 })
    }

    const request = await Requests.findById(id)
    if (!request) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 })
    }

    const donorObjectId = new mongoose.Types.ObjectId(donorId)

    const newDonation = {
      amount,
      donor: donorObjectId,
      paymentIntentId,
    }

    const updatedRequest = await Requests.findByIdAndUpdate(
      id,
      {
        $inc: {
          donationNumber: 1,
          donationReceived: amount,
        },
        $push: { donations: newDonation },
        $addToSet: { donors: donorObjectId }, // Use ObjectId here too
      },
      { new: true }
    )

    return NextResponse.json(updatedRequest)
  } catch (error) {
    console.log("Error updating donation:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
