import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import User from "../../../../../models/Users"
import connectionDB from "../../../../libs/connectionDB"
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(req) {
    await connectionDB()

    try {
        // Get token from cookies
        const cookie = (await cookies(req)).get("auth_token")
        const token = cookie?.value

        if (!token) {
            return NextResponse.json({ error: "No authentication token found" }, { status: 401 })
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
        const userId = decoded.userId || decoded.id

        if (!userId) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 })
        }

        // Parse form data
        const formData = await req.formData()
        const name = formData.get('name')
        const email = formData.get('email')
        const profilePicture = formData.get('profilePicture')

        // Validate required fields
        if (!name || !email) {
            return NextResponse.json({ error: "Name and email are required" }, { status: 400 })
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
        }

        // Check if email is already taken by another user
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
            // Validate file type
            if (!profilePicture.type.startsWith('image/')) {
                return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 })
            }

            // Validate file size (5MB limit)
            if (profilePicture.size > 5 * 1024 * 1024) {
                return NextResponse.json({ error: "Image size must be less than 5MB" }, { status: 400 })
            }

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

        // Update user in database
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

        if (error.name === 'JsonWebTokenError') {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 })
        }

        if (error.name === 'TokenExpiredError') {
            return NextResponse.json({ error: "Token expired" }, { status: 401 })
        }

        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message)
            return NextResponse.json({ error: validationErrors.join(', ') }, { status: 400 })
        }

        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}