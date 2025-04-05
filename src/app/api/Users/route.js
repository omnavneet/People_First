import { NextResponse } from "next/server"
import User from "../../../../models/Users"
import connectionDB from "../../../libs/connectionDB"
import { z } from "zod"

const userSchema = z.object({
  name: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 8 characters"),
  profilePicture: z.string().url("Invalid URL format").optional(),
})

//Create a New User
export async function POST(req) {
  await connectionDB()
  const data = await req.json()

  const validatedData = userSchema.parse(data)

  try {
    const user = await User.create(validatedData)
    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ error: error.message })
  }
}

//Get All Users
export async function GET() {
  await connectionDB()
  const users = await User.find()
  return NextResponse.json(users)
}

