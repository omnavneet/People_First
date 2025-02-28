import { NextResponse } from "next/server"
import Events from "../../../../models/Events"
import connectionDB from "../../../../libs/connectionDB"

const updateEventSchema = z.object({
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

//Get Events By ID
export async function GET(req, { params }) {
  await connectionDB()
  const { id } = params

  try {
    const event = await Events.findById(id)

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    return NextResponse.json(event)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

//Edit Event By ID
export async function PUT(req, { params }) {
  await connectionDB()
  const { id } = params

  const data = await req.json()
  const validatedData = updateEventSchema.parse(data)

  try {
    const event = await Events.findByIdAndUpdate(id, validatedData, {
      new: true,
    })
    return NextResponse.json(event)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

//Delete Event By ID
export async function DELETE(req, { params }) {
  await connectionDB()
  const { id } = params

  try {
    const event = await Events.findByIdAndDelete(id)

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    return NextResponse.json(event)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
