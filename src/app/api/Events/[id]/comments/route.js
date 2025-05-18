import { NextResponse } from "next/server"
import Events from "../../../../../../models/Events"
import connectionDB from "../../../../../libs/connectionDB"

// Add a comment to an event
export async function POST(req, { params }) {
  await connectionDB()
  const { id } = params

  try {
    const { userId, content } = await req.json()

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: "Comment content is required" },
        { status: 400 }
      )
    }

    const event = await Events.findById(id)

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    // Add the new comment
    event.comments.push({
      user: userId,
      content: content.trim(),
      createdAt: new Date(),
    })

    await event.save()

    // Repopulate the event data
    await event.populate("user", "name profilePicture")
    await event.populate("volunteers", "name profilePicture")
    await event.populate("comments.user", "name profilePicture")

    return NextResponse.json(event)
  } catch (error) {
    console.error("Comment post error:", error)
    return NextResponse.json(
      { error: "Failed to post comment" },
      { status: 500 }
    )
  }
}

// Get all comments for an event
export async function GET(req, { params }) {
  await connectionDB()
  const { id } = params

  try {
    const event = await Events.findById(id)
      .populate("comments.user", "name profilePicture")
      .select("comments")

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    return NextResponse.json({ comments: event.comments })
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    )
  }
}
