import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import User from "../../../../../models/Users"
import connectionDB from "../../../../libs/connectionDB"
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(req) {
    await connectionDB()

    const cookie = (await cookies(req)).get("auth_token")
    const token = cookie?.value

    if (!token) {
        return NextResponse.json({ error: "No token provided" })
    }

    try {
        const { payload } = await jwtVerify(
            token,
            new TextEncoder().encode(process.env.JWT_SECRET)
        )

        const { _id } = payload
        const userId = _id

        const formData = await req.formData()
        const name = formData.get('name')
        const email = formData.get('email')
        const profilePicture = formData.get('profilePicture')

        const existingUser = await User.findOne({
            email: email.toLowerCase(),
            _id: { $ne: userId }
        })

        if (existingUser) {
            return NextResponse.json({ error: "Email is already taken" }, { status: 400 })
        }

        let profilePicturePath = null

        // Handle profile picture upload
        if (profilePicture && profilePicture.size > 0) {

            // Create uploads directory if it doesn't exist
            const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'profiles')

            try {
                await mkdir(uploadsDir, { recursive: true })
            } catch (error) {
                console.log("Directory already exists or error creating:", error)
            }

            // Generate unique filename
            const timestamp = Date.now()
            const fileExtension = profilePicture.name.split('.').pop()
            const fileName = `profile_${userId}_${timestamp}.${fileExtension}`
            const filePath = path.join(uploadsDir, fileName)

            // Convert file to buffer and save
            const bytes = await profilePicture.arrayBuffer()
            const buffer = Buffer.from(bytes)

            await writeFile(filePath, buffer)

            // Set the path for database storage (relative to public folder)
            profilePicturePath = `/uploads/profiles/${fileName}`
        }

        // Prepare update data
        const updateData = {
            name: name.trim(),
            email: email.toLowerCase().trim(),
        }

        // Add profile picture path if uploaded
        if (profilePicturePath) {
            updateData.profilePicture = profilePicturePath
        }

        // Update user profile
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        ).select('-password')

        if (!updatedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        return NextResponse.json({
            message: "Profile updated successfully",
            user: updatedUser
        })

    } catch (error) {
        console.log("Error updating user profile:", error)
        return NextResponse.json({ error: error.message })
    }
}