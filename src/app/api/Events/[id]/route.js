import { NextResponse } from "next/server"
import Events from "../../../../../models/Events"
import connectionDB from "../../../../libs/connectionDB"

export async function GET(req, { params }) {
  await connectionDB()

  const { id } = params

  try {
    const event = await Events.findById(id)
      .populate("user", "name profilePicture")
      .populate("volunteers", "name profilePicture")
      .populate("comments.user", "name profilePicture")

    // Return 404 if event not found
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    return NextResponse.json(event)
  } catch (error) {
    console.log("Error fetching event:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(req, { params }) {
  await connectionDB()

  const { id } = params

  const data = await req.json()

  try {
    const event = await Events.findByIdAndUpdate(id, data, {
      new: true,
    })

    return NextResponse.json(event)
  } catch (error) {
    console.log("Error updating event:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(req, { params }) {
  await connectionDB()

  const { id } = params

  try {
    const event = await Events.findByIdAndDelete(id)

    // Return 404 if event not found
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    return NextResponse.json(event)
  } catch (error) {
    console.log("Error deleting event:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
