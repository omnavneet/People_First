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
  const { id } = await params

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

//Like event
export async function POST(req, { params }) {
  await connectionDB()
  const { id } = params

  try {
    const { userId } = await req.json()

    const event = await Events.findById(id)

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    const likedIndex = event.likedBy.findIndex(
      (likedUserId) => likedUserId.toString() === userId
    )

    if (likedIndex > -1) {
      event.likedBy.splice(likedIndex, 1)
      event.likes = Math.max(0, event.likes - 1)
    } else {
      event.likedBy.push(userId)
      event.likes = (event.likes || 0) + 1
    }

    await event.save()

    await event.populate("user", "name profilePicture")
    await event.populate("likedBy", "name")

    return NextResponse.json(event)
  } catch (error) {
    console.error("Like toggle error:", error)
    return NextResponse.json(
      { error: "Failed to toggle like" },
      { status: 500 }
    )
  }
}
