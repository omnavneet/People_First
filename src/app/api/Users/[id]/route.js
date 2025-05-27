import { NextResponse } from "next/server"
import User from "../../../../../models/Users"
import connectionDB from "../../../../libs/connectionDB"

export async function GET(req, { params }) {
  await connectionDB()

  const { id } = params

  try {
    const user = await User.findById(id)

    // Return 404 if user not found
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 })

    return NextResponse.json(user)
  } catch (error) {
    console.log("Error fetching user:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(req, { params }) {
  await connectionDB()

  const { id } = params

  try {
    const data = await req.json()

    const user = await User.findByIdAndUpdate(id, data, { new: true })

    // Return 404 if user not found
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 })

    return NextResponse.json(user)
  } catch (error) {
    console.log("Error updating user:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(req, { params }) {
  await connectionDB()

  const { id } = params

  try {
    const user = await User.findByIdAndDelete(id)

    // Return 404 if user not found
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 })

    return NextResponse.json(user)
  } catch (error) {
    console.log("Error deleting user:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
