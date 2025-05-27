import { NextResponse } from "next/server"
import Events from "../../../../../../models/Events"
import connectionDB from "../../../../../libs/connectionDB"

export async function POST(req, { params }) {
  try {
    await connectionDB()
    
    const { id } = params
    const { userId, content } = await req.json()

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: "Comment content is required" },
        { status: 400 }
      )
    }

    const event = await Events.findById(id)

    // Return 404 if event not found
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    event.comments.push({
      user: userId,
      content: content.trim(),
      createdAt: new Date(),
    })

    await event.save()
    await event.populate("user", "name profilePicture")
    await event.populate("volunteers", "name profilePicture")
    await event.populate("comments.user", "name profilePicture")

    return NextResponse.json(event)
  } catch (error) {
    console.log("Comment post error:", error)
    return NextResponse.json(
      { error: "Failed to post comment" },
      { status: 500 }
    )
  }
}

export async function GET(req, { params }) {
  try {
    await connectionDB()
    
    const { id } = params

    const event = await Events.findById(id)
      .populate("comments.user", "name profilePicture")
      .select("comments")

    // Return 404 if event not found
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    return NextResponse.json({ comments: event.comments })
  } catch (error) {
    console.log("Error fetching comments:", error)
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    )
  }
}
