import { NextResponse } from "next/server"
import Requests from "../../../../../models/Requests"
import connectionDB from "../../../../libs/connectionDB"

export async function GET(req, { params }) {
  try {
    await connectionDB()

    const { id } = params

    const request = await Requests.findById(id)
      .populate("user", "name email profilePicture")
      .populate("donations.donor", "name email profilePicture")
      .populate("donors", "name email profilePicture")
      .exec()

    // Return 404 if request not found
    if (!request) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 })
    } return NextResponse.json(request)
  } catch (error) {
    console.log("Error fetching request:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(req, { params }) {
  try {
    await connectionDB()

    const { id } = params
    const data = await req.json()

    const request = await Requests.findByIdAndUpdate(id, data, {
      new: true,
    })

    // Return 404 if request not found
    if (!request) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 })
    }

    return NextResponse.json(request)
  } catch (error) {
    console.log("Error updating request:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectionDB()

    const { id } = params

    const request = await Requests.findByIdAndDelete(id)

    // Return 404 if request not found
    if (!request) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Request deleted successfully",
      deletedRequest: request,
    })
  } catch (error) {
    console.log("Error deleting request:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
