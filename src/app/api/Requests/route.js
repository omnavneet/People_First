import { NextResponse } from "next/server"
import Requests from "../../../../models/Requests"
import connectionDB from "../../../libs/connectionDB"
import { z } from "zod"
import mongoose from "mongoose"

const requestSchema = z.object({
  title: z.string().min(1, "Title is required").max(50),
  description: z.string().min(20, "Description is required"),
  user: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid User ID",
  }),
  donationNumber: z.number().int().positive("Donation number must be positive"),
  donationGoal: z.number().int().positive("Donation goal must be positive"),
  status: z.enum(["open", "closed"]).optional(),
  donationReceived: z
    .number()
    .int()
    .nonnegative("Donation received must be a positive number")
    .optional(),
  image: z.string().url("Invalid image URL").optional(),
  likes: z
    .number()
    .int()
    .nonnegative("Likes must be a positive number")
    .optional(),
})

//Get All Requests
export async function GET() {
  await connectionDB()
  const requests = await Requests.find()
  return NextResponse.json(requests)
}

//Create Request
export async function POST(req) {
  await connectionDB()
  const data = await req.json()

  const validatedData = requestSchema.parse(data)

  try {
    const request = await Requests.create(validatedData)
    return NextResponse.json(request)
  } catch (error) {
    return NextResponse.json({ error: error.message })
  }
}
