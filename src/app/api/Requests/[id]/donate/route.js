import { NextResponse } from "next/server"
import Requests from "../../../../../../models/Requests"
import connectionDB from "../../../../../libs/connectionDB"

export async function POST(req, { params }) {
  await connectionDB()
  const { id } = params

  try {
    const { amount } = await req.json()
    const request = await Requests.findById(id)
    if (!request) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 })
    }

    const updatedRequest = await Requests.findByIdAndUpdate(
      id,
      {
        $inc: {
          donationNumber: 1,
          donationReceived: amount,
        },
      },
      { new: true }
    )

    return NextResponse.json(updatedRequest)
  } catch (error) {
    console.error("Error updating donation:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
