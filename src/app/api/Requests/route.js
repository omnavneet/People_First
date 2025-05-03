import { NextResponse } from "next/server"
import Requests from "../../../../models/Requests"
import connectionDB from "../../../libs/connectionDB"
import { analyzeRequestTrust } from '../../../libs/trustAnalysis'

//Get All Requests
export async function GET() {
  await connectionDB()
  const requests = await Requests.find()
  return NextResponse.json(requests)
}

//Create Request
export async function POST(req) {
  await connectionDB()
  const data = await req.json()

  try {
    const trustAnalysis = await analyzeRequestTrust(data)
    const request = await Requests.create({
      ...data,
      trustAnalysis,
    })

    console.log(trustAnalysis)

    return NextResponse.json({ success: true, request })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
