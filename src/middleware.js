import jwt from "jsonwebtoken"
import { NextResponse } from "next/server"

export const middleware = async (req) => {
  const publicRoutes = ["/", "/sign-in", "/sign-up"]
  const path = req.nextUrl.pathname

  if (publicRoutes.includes(path)) {
    return NextResponse.next()
  }

  const bearer = req.headers.get("authorization")

  if (!bearer) {
    console.log("No bearer")
    NextResponse.redirect(new URL("/sign-in", req.url))
  }

  //bearer token
  const [, token] = bearer.split(" ")

  if (!token) {
    console.log("No token")
    return NextResponse.redirect(new URL("/sign-in", req.url))
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET)
    return NextResponse.next()
  } catch (error) {
    return NextResponse.redirect(new URL("/sign-in", req.url))
  }
}

export const config = {
  matcher: "/api/Users",
}
