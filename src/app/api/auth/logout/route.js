import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(req) {
  const cookieStore = cookies()

  cookieStore.set("auth_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
  })

  return NextResponse.redirect(new URL("/sign-in", req.url))
}
