import connectionDB from "../connectionDB"
import User from "../../../models/Users"
import bcrypt from "bcrypt"
import { comparePasswords, createJWT } from "../auth"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export const createNewUser = async (req) => {
  await connectionDB()

  const formData = await req.formData()

  const userName = formData.get("userName")
  const password = formData.get("password")
  const email = formData.get("email")
  const profilePicture = formData.get("profilePicture")

  const existingUser = await User.findOne({ email })
  if (existingUser) {
    return NextResponse.json({ error: "User already exists" })
  }

  const hashPassword = await bcrypt.hash(password, 5)

  const user = new User({
    name: userName,
    email,
    password: hashPassword,
    profilePicture: profilePicture || null,
  })

  await user.save()

  const token = createJWT(user)

  const cookieStore = await cookies()
  cookieStore.set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  })

  return NextResponse.json({ token })
}

export const signin = async (req) => {

  await connectionDB()

  const formData = await req.formData()

  const name = formData.get("userName")
  const password = formData.get("password")

  const user = await User.findOne({ name })

  if (!user) {
    return NextResponse.json({ error: "User not found" })
  }

  const isValid = await comparePasswords(password, user.password)

  if (!isValid) {
    return NextResponse.json({ error: "Invalid credentials" })
  }

  const token = createJWT(user)

  const cookieStore = await cookies()
  cookieStore.set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  })

  return NextResponse.json({ token })
}
