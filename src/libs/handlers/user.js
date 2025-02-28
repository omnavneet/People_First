import connectionDB from "../connectionDB"
import User from "../../../models/User"
import bcrypt from "bcrypt"
import { comparePasswords, createJWT } from "../auth"

export const createNewUser = async (req) => {
  await connectionDB()

  const formData = await req.formData()

  const userName = formData.get("userName")
  const password = formData.get("password")
  const email = formData.get("email")
  const profilePicture = formData.get("profilePicture")

  const existingUser = await User.findOne({ email })
  if (existingUser) {
    return new Response(JSON.stringify({ error: "User already exists" }))
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
  return new Response(JSON.stringify({ token }))
}

export const signin = async (req) => {
  await connectionDB()

  const formData = await req.formData()

  const name = formData.get("userName")
  const password = formData.get("password")

  const user = await User.findOne({ name })

  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }))
  }

  const isValid = await comparePasswords(password, user.password)

  if (!isValid) {
    return new Response(JSON.stringify({ error: "Invalid credentials" }))
  }

  const token = createJWT(user)
  return new Response(JSON.stringify({ token }))
}
