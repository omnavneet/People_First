import { NextResponse } from "next/server"
import Events from "../../../../models/Events"
import connectionDB from "../../../libs/connectionDB"
import { z } from "zod"

const eventSchema = z.object({
  title: z.string().min(1, "Title is required").max(50),
  description: z.string().min(20, "Description is required"),
  user: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid User ID",
  }),
  image: z.string().url("Invalid image URL").optional(),
  likes: z
    .number()
    .int()
    .nonnegative("Likes must be a positive number")
    .optional(),
  status: z.enum(["upcoming", "completed", "cancelled"]).optional(),
})

//Get All Events
export async function GET() {
  await connectionDB()
  const events = await Events.find()
  return NextResponse.json(events)
}

//Create Event
export async function POST(req) {
  await connectionDB()
  const data = await req.json()
  const validatedData = eventSchema.parse(data)

  try {
    const event = await Events.create(validatedData)
    return NextResponse.json(event)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
