import { NextResponse } from "next/server"
import Events from "../../../../models/Events"
import connectionDB from "../../../libs/connectionDB"

//Get All Events
export async function GET() {
  await connectionDB()
  const events = await Events.find()
  return NextResponse.json(events)
}

//Create Event
export async function POST(req) {
  await connectionDB()
  const data = await req.json()

  try {
    const event = await Events.create(data)
    return NextResponse.json(event)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
