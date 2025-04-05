import connectionDB from "@/libs/connectionDB"
import { jwtVerify } from "jose"
import User from "models/Users"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

//Get a User by ID
export async function GET(req) {
  await connectionDB()
  const cookie = (await cookies(req)).get("auth_token")
  const token = cookie.value
  console.log(cookie)

  if (!token) {
    return NextResponse.json({ error: "No token provided" })
  }
  console.log(token)

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    )
    const { _id } = payload
    const id = _id

    const user = await User.findById(id)
    console.log(user)
    if (!user) {
      return NextResponse.json({ error: "User not found" })
    }

    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ error: error.message })
  }
}
