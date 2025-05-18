import { NextResponse } from "next/server"
import User from "../../../../models/Users"
import connectionDB from "../../../libs/connectionDB"

//Create a New User
export async function POST(req) {
  await connectionDB()
  const data = await req.json()

  try {
    const user = await User.create(data)
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
