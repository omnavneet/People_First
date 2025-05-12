"use client"
import { useRouter } from "next/navigation"
import React, { useState, useEffect } from "react"
import { z } from "zod"

const NewEventPage = () => {
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    image: "",
    status: "upcoming",
  })
  const [imagePreview, setImagePreview] = useState(null)
  const [userId, setUserId] = useState(null)
  const [error, setError] = useState(null)
  const router = useRouter()

  const InputSchema = z.object({
    title: z.string().min(5).max(100),
    description: z.string().min(20),
    image: z.string(),
    status: z.enum(["upcoming", "completed", "cancelled"]),
  })

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/Users/current", {
          method: "GET",
          credentials: "include",
        })
        const data = await response.json()
        if (data?._id) {
          setUserId(data?._id)
        } else {
          console.error("User not authenticated")
          setError("User not found or not authenticated")
        }
      } catch (error) {
        console.error("Error fetching user:", error)
        setError("Error fetching user data")
      }
    }

    fetchUser()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewEvent((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type and size
      const validTypes = ['image/jpeg', 'image/png', 'image/gif']
      const maxSize = 5 * 1024 * 1024 // 5MB

      if (!validTypes.includes(file.type)) {
        setError("Invalid file type. Please upload JPEG, PNG, or GIF.")
        return
      }

      if (file.size > maxSize) {
        setError("File is too large. Maximum size is 5MB.")
        return
      }

      // Create file reader to generate base64 preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
        setNewEvent((prev) => ({
          ...prev,
          image: reader.result
        }))
        setError(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleNewEvent = async () => {
    if (!userId) {
      setError("You need to be logged in to create an event")
      return
    }

    try {
      InputSchema.parse(newEvent)
      setError(null)
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError(error.errors)
        console.error("Validation error:", error.errors)
        return
      }
    }

    try {
      const response = await fetch("/api/Events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newEvent,
          user: userId,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Event creation failed: ${errorText}`)
      }

      const data = await response.json()
      console.log("Event created successfully:", data)
      router.push(`/events/${data?.event?._id}`)
    } catch (error) {
      console.error("Error creating event:", error)
      setError(error.message)
    }
  }

  return (
    <div className="p-4 md:p-8 lg:px-32 bg-gray-50 min-h-screen">
      <div className="w-full max-w-4xl mx-auto p-6 md:p-10 bg-pink-50 rounded-2xl shadow-xl border border-gray-100">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">
          Create New Event
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Title<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={newEvent.title}
                onChange={handleInputChange}
                className="w-full p-3.5 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all placeholder-gray-400"
                placeholder="Enter event title"
                required
              />
              {error && error.some?.((e) => e.path[0] === "title") && (
                <p className="text-red-500 text-sm mt-1">
                  {error.find((e) => e.path[0] === "title")?.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Description<span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={newEvent.description}
                onChange={handleInputChange}
                rows="7"
                className="w-full p-3.5 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all placeholder-gray-400"
                placeholder="Describe your event in detail..."
                required
              />
              {error && error.some?.((e) => e.path[0] === "description") && (
                <p className="text-red-500 text-sm mt-1">
                  {error.find((e) => e.path[0] === "description")?.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Event Image
              </label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif"
                onChange={handleImageUpload}
                className="w-full p-3.5 border border-gray-300 rounded-xl shadow-sm file:mr-4 file:rounded-md file:border-0 file:bg-pink-500 file:px-4 file:py-2 file:text-white hover:file:bg-pink-600"
              />
              {error && typeof error === 'string' && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
              )}

              {/* Image Preview */}
              {imagePreview && (
                <div className="mt-4">
                  <img
                    src={imagePreview}
                    alt="Event Preview"
                    className="w-full h-48 object-cover rounded-xl shadow-md"
                  />
                </div>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Status<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="status"
                  value={newEvent.status}
                  onChange={handleInputChange}
                  className="w-full p-3.5 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all placeholder-gray-400 appearance-none bg-white pr-10"
                  required
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                {error && error.some?.((e) => e.path[0] === "status") && (
                  <p className="text-red-500 text-sm mt-1">
                    {error.find((e) => e.path[0] === "status")?.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={handleNewEvent}
            className="w-full px-6 py-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl hover:from-pink-600 hover:to-pink-700 transition-all shadow-md hover:shadow-lg"
          >
            Create Event
          </button>
        </div>
      </div>
    </div>
  )
}

export default NewEventPage