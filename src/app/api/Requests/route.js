import { NextResponse } from "next/server"
import Requests from "../../../../models/Requests"
import connectionDB from "../../../libs/connectionDB"

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
    const request = await Requests.create(validatedData)
    return NextResponse.json({ success: true, request })
  } catch (error) {
    return NextResponse.json({ error: error.message })
  }
}
