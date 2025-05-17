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
    eventDate: "",
  })
  const [imagePreview, setImagePreview] = useState(null)
  const [userId, setUserId] = useState(null)
  const [error, setError] = useState(null)
  const router = useRouter()

  const InputSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters").max(100),
    description: z.string().min(20, "Description must be at least 20 characters"),
    image: z.string().nonempty("Image is required"),
    status: z.enum(["upcoming", "completed", "cancelled"]),
    eventDate: z.string().nonempty("Date is required"),
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
          setUserId(data._id)
        } else {
          setError("User not authenticated")
        }
      } catch (error) {
        console.error("Error fetching user:", error)
        setError("Error fetching user")
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
      const validTypes = ['image/jpeg', 'image/png', 'image/gif']
      const maxSize = 5 * 1024 * 1024

      if (!validTypes.includes(file.type)) {
        setError("Invalid file type. Please upload JPEG, PNG, or GIF.")
        return
      }

      if (file.size > maxSize) {
        setError("File is too large. Maximum size is 5MB.")
        return
      }

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
    if (!userId) return

    try {
      InputSchema.parse(newEvent)
      setError(null)
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError(error.errors)
        return
      }
    }

    try {
      const response = await fetch("/api/Events", {
        method: "POST",
        body: JSON.stringify({
          ...newEvent,
          user: userId,
          eventDate: new Date(newEvent.eventDate).getTime(),
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText)
      }

      const data = await response.json()
      router.push(`/events`)
    } catch (error) {
      setError(error.message || "Event creation failed")
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
                className="w-full p-3.5 border border-gray-300 rounded-xl shadow-sm"
                placeholder="Enter event title"
              />
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
                className="w-full p-3.5 border border-gray-300 rounded-xl shadow-sm"
                placeholder="Describe your event..."
              />
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
                className="w-full p-3.5 border border-gray-300 rounded-xl shadow-sm"
              />
              {typeof error === "string" && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
              )}
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

            {/* Event Date */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Event Date<span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="eventDate"
                value={newEvent.eventDate}
                onChange={handleInputChange}
                className="w-full p-3.5 border border-gray-300 rounded-xl shadow-sm"
              />
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={handleNewEvent}
            className="w-full px-6 py-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl"
          >
            Create Event
          </button>
        </div>
      </div>
    </div>
  )
}

export default NewEventPage
