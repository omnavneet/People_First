import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

export const comparePasswords = (password, hash) => {
  return bcrypt.compare(password, hash)
}

export const hashPassword = (password) => {
  return bcrypt.hash(password, 10)
}

export const createJWT = (user) => {
  const token = jwt.sign(
    {
      id: user.id,
      userName: user.userName,
    },
    process.env.JWT_SECRET
  )
  return token
}
