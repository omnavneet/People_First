import { NextResponse } from "next/server"
import User from "../../../../../models/Users"
import connectionDB from "../../../../libs/connectionDB"

//Get UserData by ID
export async function GET(req, { params }) {
  await connectionDB()
  const { id } = params

  try {
    const user = await User.findById(id)
    console.log(user)
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

//Update User By ID
export async function PUT(req, { params }) {
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
export async function DELETE(req, { params }) {
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
