import { NextResponse } from "next/server"
import Events from "../../../../../models/Events"
import connectionDB from "../../../../libs/connectionDB"

//Get Events By ID
export async function GET(req, { params }) {
  await connectionDB()
  const { id } = params

  try {
    const event = await Events.findById(id).populate(
      "user",
      "name profilePicture"
    )

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    return NextResponse.json(event)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

//Edit Event By ID
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
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

//Delete Event By ID
export async function DELETE(req, { params }) {
  await connectionDB()
  const { id } = params

  try {
    const event = await Events.findByIdAndDelete(id)

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    return NextResponse.json(event)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
