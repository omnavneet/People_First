import { NextResponse } from "next/server"

export async function GET() {
  const apiKey = process.env.GNEWS_API_KEY

  const query = encodeURIComponent(
    "earthquake OR flood OR cyclone OR fire OR landslide OR disaster OR outbreak"
  )

  const url = `https://gnews.io/api/v4/search?q=${query}&lang=en&country=in&max=10&token=${apiKey}`
  try {
    const response = await fetch(url)
    const data = await response.json()

    return NextResponse.json(data.articles || [])
  } catch (error) {
    console.log("News fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch news." },
      { status: 500 }
    )
  }
}
