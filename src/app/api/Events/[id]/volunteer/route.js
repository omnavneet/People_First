import { NextResponse } from "next/server"
import Events from "../../../../../../models/Events"
import connectionDB from "../../../../../libs/connectionDB"

export async function POST(req, { params }) {
  await connectionDB()
  
  const { id } = params

  try {
    const { userId } = await req.json()

    const event = await Events.findById(id)

    // Return 404 if event not found
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }    // Check if user is already a volunteer
    const volunteerIndex = event.volunteers?.findIndex(
      (volunteerId) => volunteerId.toString() === userId
    )

    if (volunteerIndex > -1) {
      event.volunteers.splice(volunteerIndex, 1)
    } else {
      if (!event.volunteers) {
        event.volunteers = []
      }
      event.volunteers.push(userId)
    }

    await event.save()

    await event.populate("user", "name profilePicture")
    await event.populate("volunteers", "name profilePicture")
    await event.populate("comments.user", "name profilePicture")

    return NextResponse.json(event)
  } catch (error) {    console.log("Volunteer toggle error:", error)
    return NextResponse.json(
      { error: "Failed to toggle volunteer status" },
      { status: 500 }
    )
  }
}
