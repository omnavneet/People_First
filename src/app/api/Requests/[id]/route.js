import { NextResponse } from "next/server"
import Requests from "../../../../models/Requests"
import connectionDB from "../../../../libs/connectionDB"

//Get Requests By ID
export async function GET(req, { params }) {
  await connectionDB()
  const { id } = params

  try {
    const request = await Requests.findById(id)
    if (!request) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 })
    }

    return NextResponse.json(request)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

//Edit Request By ID
export async function PUT(req, { params }) {
  await connectionDB()
  const { id } = params

  const data = await req.json()

  try {
    const request = await Requests.findByIdAndUpdate(id, data, { new: true })
    return NextResponse.json(request)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

//Delete Request By ID
export async function DELETE(req, { params }) {
  await connectionDB()
  const { id } = params

  try {
    const request = await Requests.findByIdAndDelete(id)

    if (!request) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 })
    }
    return NextResponse.json(request)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
