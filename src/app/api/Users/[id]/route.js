import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import User from "../../../../../models/Users"
import connectionDB from "../../../../libs/connectionDB"

export async function GET(req, { params }) {
  await connectionDB()

  const { id } = params

  try {
    const user = await User.findById(id).select('-password')
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.log("Error fetching user:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(req, { params }) {
  await connectionDB()

  const { id } = params

  // Get auth token for validation
  const cookie = (await cookies(req)).get("auth_token")
  const token = cookie?.value

  if (!token) {
    return NextResponse.json({ error: "No token provided" }, { status: 401 })
  }

  try {
    // Verify JWT token
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    )

    const { _id: tokenUserId } = payload

    // Ensure user can only update their own profile
    if (tokenUserId !== id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Check if request has FormData (for file uploads) or JSON
    const contentType = req.headers.get('content-type')
    let updateData = {}

    if (contentType && contentType.includes('multipart/form-data')) {
      // Handle FormData (with potential file upload)
      const formData = await req.formData()
      const name = formData.get('name')
      const email = formData.get('email')
      const profilePicture = formData.get('profilePicture')

      updateData = {
        name: name?.trim(),
        email: email?.toLowerCase().trim(),
      }

      // Handle profile picture upload (convert to base64)
      if (profilePicture && profilePicture.size > 0) {
        try {
          const bytes = await profilePicture.arrayBuffer()
          const buffer = Buffer.from(bytes)
          const base64String = buffer.toString('base64')
          const dataUri = `data:${profilePicture.type};base64,${base64String}`

          updateData.profilePicture = dataUri
        } catch (uploadError) {
          console.log("Error processing image:", uploadError)
          return NextResponse.json({ error: "Failed to process image" }, { status: 500 })
        }
      }
    } else {
      // Handle JSON data
      updateData = await req.json()
      if (updateData.email) {
        updateData.email = updateData.email.toLowerCase().trim()
      }
      if (updateData.name) {
        updateData.name = updateData.name.trim()
      }
    }

    // Check if email is already taken by another user
    if (updateData.email) {
      const existingUser = await User.findOne({
        email: updateData.email,
        _id: { $ne: id }
      })

      if (existingUser) {
        return NextResponse.json({ error: "Email is already taken" }, { status: 400 })
      }
    }

    // Update user
    const user = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password')

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "User updated successfully",
      user: user
    })
  } catch (error) {
    console.log("Error updating user:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(req, { params }) {
  await connectionDB()

  const { id } = params

  // Get auth token for validation
  const cookie = (await cookies(req)).get("auth_token")
  const token = cookie?.value

  if (!token) {
    return NextResponse.json({ error: "No token provided" }, { status: 401 })
  }

  try {
    // Verify JWT token
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    )

    const { _id: tokenUserId } = payload

    // Ensure user can only delete their own profile
    if (tokenUserId !== id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const user = await User.findByIdAndDelete(id)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "User deleted successfully",
      deletedUser: user
    })
  } catch (error) {
    console.log("Error deleting user:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}