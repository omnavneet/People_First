import { NextResponse } from "next/server"
import User from "../../../../models/User"
import connectionDB from "../../../../libs/connectionDB"

//Get User By ID
export async function GET(req, { params }) {
  await connectionDB()
  const { id } = params

  try {
    const user = await User.findById(id)
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

//Update User By ID
export async function PUT(req) {
  await connectionDB()
  const { id } = params

  try {
    const data = await req.json()
    const user = await User.findByIdAndUpdate(id, data, { new: true })
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

//Delete User By ID
export async function DELETE(req) {
  await connectionDB()
  const { id } = params

  try {
    const user = await User.findByIdAndDelete(id)
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
