import connectionDB from "../connectionDB"
import User from "../../../models/User"
import bcrypt from "bcrypt"
import { comparePasswords, createJWT } from "../auth"

export const createNewUser = async (req) => {
  await connectionDB()

  const { name, password, email, profilePicture } = await req.json()

  const existingUser = await User.findOne({ email })
  if (existingUser) {
    return new Response(JSON.stringify({ error: "User already exists" }))
  }

  const hashPassword = await bcrypt.hash(password, 5)

  const user = new User({
    name,
    email,
    password: hashPassword,
    profilePicture,
  })

  await user.save()

  const token = createJWT(user)
  return new Response(JSON.stringify({ token }))
}

export const signin = async (req) => {
  await connectionDB()

  const { name, password } = await req.json()

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
