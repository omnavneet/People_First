import { NextResponse } from "next/server"
import Requests from "../../../../models/Requests"
import connectionDB from "../../../libs/connectionDB"
import { LanguageServiceClient } from "@google-cloud/language"

// Instantiate the Google Cloud Natural Language client
const client = new LanguageServiceClient()

// Function to verify event description with Google Cloud NLP
const verifyEventDescription = async (description) => {
  const document = {
    content: description,
    type: "PLAIN_TEXT",
  }

  try {
    const [result] = await client.analyzeSentiment({ document })
    const sentimentScore = result.documentSentiment.score

    // Flag events with negative sentiment
    return sentimentScore >= 0
  } catch (error) {
    console.error("Error analyzing event description:", error)
    return false
  }
}

// Get All Requests
export async function GET() {
  await connectionDB()
  const requests = await Requests.find()
  return NextResponse.json(requests)
}

// Create Request with event description verification
export async function POST(req) {
  await connectionDB()
  const data = await req.json()

  try {
    // Verify the event description
    const isLegitimate = await verifyEventDescription(data.description)

    if (!isLegitimate) {
      return NextResponse.json({
        error: "Event description flagged as suspicious.",
      })
    }

    // If legitimate, create the request
    const request = await Requests.create(data)
    return NextResponse.json({ success: true, request })
  } catch (error) {
    return NextResponse.json({ error: error.message })
  }
}
