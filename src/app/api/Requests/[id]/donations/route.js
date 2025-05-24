import { NextResponse } from "next/server"
import Requests from "../../../../../../models/Requests"
import connectionDB from "../../../../../libs/connectionDB"

export async function GET(req, { params }) {
  await connectionDB()
  const { id } = params

  try {
    const request = await Requests.findById(id).populate(
      "donations.donor",
      "name profilePicture email"
    )

    if (!request) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 })
    }

    const donations = request.donations
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10)

    return NextResponse.json({ donations })
  } catch (error) {
    console.error("Error fetching donations:", error)
    return NextResponse.json(
      { error: "Failed to fetch donations" },
      { status: 500 }
    )
  }
}
