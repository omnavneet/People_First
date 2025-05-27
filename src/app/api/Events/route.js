import { NextResponse } from "next/server"
import Events from "../../../../models/Events"
import connectionDB from "../../../libs/connectionDB"
import { analyzeEventTrust } from "../../../libs/eventAnalysis"

export async function GET() {
  await connectionDB()
  
  const events = await Events.find()
  
  return NextResponse.json(events)
}

export async function POST(req) {
  await connectionDB()
  
  const data = await req.json()

  try {
    const eventAnalysis = await analyzeEventTrust(data)
    
    const event = await Events.create({
      ...data,
      eventAnalysis,
    })
    
    return NextResponse.json(event)
  } catch (error) {
    console.log("Event creation error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
