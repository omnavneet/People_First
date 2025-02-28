import { NextResponse } from "next/server"
import User from "../../../../models/User"
import connectionDB from "../../../../libs/connectionDB"
import { z } from "zod"

const updateUserSchema = z.object({
  name: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 8 characters"),
  profilePicture: z.string().url("Invalid URL format").optional(),
})

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
export async function PUT(req, { params }) {
  await connectionDB()
  const { id } = params

  try {
    const data = await req.json()

    const validatedData = updateUserSchema.safeParse(data)

    const user = await User.findByIdAndUpdate(id, validatedData, { new: true })
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
