import { NextResponse } from "next/server"
import Requests from "../../../../../models/Requests"
import Users from "../../../../../models/Users"
import connectionDB from "../../../../libs/connectionDB"
import { z } from "zod"
import mongoose from "mongoose"

const UpdateRequestSchema = z.object({
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

//Get Requests By ID
export async function GET(req, { params }) {
  await connectionDB()
  const { id } = params

  try {
    const request = await Requests.findById(id).populate(
      "user",
      "name profilePicture"
    )

    if (!request) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 })
    }

    return NextResponse.json(request)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

//Edit Request By ID
export async function PUT(req, { params }) {
  await connectionDB()
  const { id } = params

  const data = await req.json()
  const validatedData = UpdateRequestSchema.parse(data)

  try {
    const request = await Requests.findByIdAndUpdate(id, validatedData, {
      new: true,
    })
    return NextResponse.json(request)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

//Delete Request By ID
export async function DELETE(req, { params }) {
  await connectionDB()
  const { id } = params

  try {
    const request = await Requests.findByIdAndDelete(id)

    if (!request) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 })
    }
    return NextResponse.json(request)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
