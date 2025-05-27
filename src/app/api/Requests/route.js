import { NextResponse } from "next/server"
import Requests from "../../../../models/Requests"
import connectionDB from "../../../libs/connectionDB"
import { analyzeRequestTrust } from '../../../libs/trustAnalysis'

export async function GET() {
  try {
    await connectionDB()
    
    const requests = await Requests.find()
    
    return NextResponse.json(requests)
  } catch (error) {
    console.log("Error fetching requests:", error)
    return NextResponse.json(
      { error: "Failed to fetch requests" },
      { status: 500 }
    )
  }
}

export async function POST(req) {
  try {
    await connectionDB()
    
    const data = await req.json()

    const trustAnalysis = await analyzeRequestTrust(data)
    
    const request = await Requests.create({
      ...data,
      trustAnalysis,
    })

    return NextResponse.json({ success: true, request })
  } catch (error) {
    console.log("Request creation error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
