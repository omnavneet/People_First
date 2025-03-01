import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"

export const middleware = async (req) => {
  const publicRoutes = ["/", "/api/auth/signup", "/api/auth/signin"]
  const path = req.nextUrl.pathname

  if (publicRoutes.includes(path)) {
    return NextResponse.next()
  }

  const cookie = (await cookies(req)).get("auth_token")
  const token = cookie?.value

  if (token === null) {
    console.log("No token")
    return NextResponse.redirect(new URL("/sign-in", req.url))
  }

  const url = req.url
  if (url.includes("/sign-in") && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    )

    console.log(payload)

    return NextResponse.next()
  } catch (error) {
    console.error(error)
    return NextResponse.redirect(new URL("/sign-in", req.url))
  }
}

export const config = {
  matcher: ["/dashboard", "/events", "/requests", "/api/:path*"],
}
