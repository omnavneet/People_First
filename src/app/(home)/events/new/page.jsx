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
  const [errors, setErrors] = useState({})
  const [generalError, setGeneralError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const router = useRouter()

  const InputSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters").max(100),
    description: z.string().min(20, "Description must be at least 20 characters"),
    image: z.string().nonempty("Image is required"),
    status: z.enum(["upcoming", "completed", "cancelled"]),
    eventDate: z.string().nonempty("Date is required"),
  })

  // Fetch current user on mount
  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("/api/Users/current", {
          method: "GET",
          credentials: "include",
        })
        const data = await response.json()
        if (data?._id) {
          setUserId(data._id)
        } else {
          setGeneralError("User not authenticated")
        }
      } catch (error) {
        console.log("Error fetching user:", error)
        setGeneralError("Error fetching user")
      } finally {
        setTimeout(() => {
          setIsLoading(false)
        }, 800)
      }
    }

    fetchUser()
  }, [])

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewEvent((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setImagePreview(null)
      const loadingTimeout = setTimeout(() => {
        const reader = new FileReader()
        reader.onloadend = () => {
          setImagePreview(reader.result)
          setNewEvent((prev) => ({
            ...prev,
            image: reader.result
          }))
          // Clear image error
          if (errors.image) {
            setErrors(prev => {
              const newErrors = { ...prev }
              delete newErrors.image
              return newErrors
            })
          }
        }
        reader.readAsDataURL(file)
      }, 600)

      return () => clearTimeout(loadingTimeout)
    }
  }

  // Handle new event creation
  const handleNewEvent = async () => {
    if (!userId) return

    try {
      InputSchema.parse(newEvent)
      setErrors({})
      setGeneralError(null)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = {}
        error.errors.forEach(err => {
          if (err.path && err.path[0]) {
            fieldErrors[err.path[0]] = err.message
          }
        })
        setErrors(fieldErrors)
        return
      }
    }

    setIsSaving(true)

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

      setShowSuccessToast(true)

      setTimeout(() => {
        router.push(`/events`)
      }, 1500)
    } catch (error) {
      setGeneralError(error.message || "Event creation failed")
      setIsSaving(false)
    }
  }

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-10 bg-gray-200 rounded-xl mb-8"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <div className="space-y-6">
          <div>
            <div className="h-6 bg-gray-200 w-1/4 rounded mb-2"></div>
            <div className="h-12 bg-gray-200 rounded-xl"></div>
          </div>
          <div>
            <div className="h-6 bg-gray-200 w-1/3 rounded mb-2"></div>
            <div className="h-40 bg-gray-200 rounded-xl"></div>
          </div>
          <div>
            <div className="h-6 bg-gray-200 w-1/3 rounded mb-2"></div>
            <div className="h-12 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <div className="h-6 bg-gray-200 w-1/3 rounded mb-2"></div>
            <div className="h-12 bg-gray-200 rounded-xl"></div>
          </div>
          <div className="h-48 bg-gray-200 rounded-xl mt-4"></div>
          <div>
            <div className="h-6 bg-gray-200 w-1/4 rounded mb-2"></div>
            <div className="h-12 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
      <div className="h-14 bg-gray-200 rounded-xl mt-8"></div>
    </div>
  )

  return (
    <div className="p-4 md:p-8 lg:px-32 bg-gradient-to-b from-pink-50 to-white min-h-screen">
      <div className="w-full max-w-4xl mx-auto p-6 md:p-10 bg-white rounded-2xl shadow-xl border border-gray-100 transition-all duration-300 hover:shadow-2xl">
        {showSuccessToast && (
          <div className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 animate-fade-in-down">
            Event created successfully!
          </div>
        )}

        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center relative">
          Create New Event
        </h2>

        {generalError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-600">{generalError}</p>
          </div>
        )}

        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="space-y-6">
                {/* Title */}
                <div className="transform transition-all duration-200">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Title<span className="text-pink-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={newEvent.title}
                    onChange={handleInputChange}
                    className="w-full p-3.5 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all duration-200"
                    placeholder="Enter event title"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                  )}
                </div>

                {/* Description */}
                <div className="transform transition-all duration-200">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Description<span className="text-pink-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={newEvent.description}
                    onChange={handleInputChange}
                    rows="7"
                    className="w-full p-3.5 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all duration-200"
                    placeholder="Describe your event..."
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                {/* Image Upload */}
                <div className="transform transition-all duration-200">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Event Image
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/gif"
                      onChange={handleImageUpload}
                      className="w-full p-3.5 border border-dashed border-pink-300 bg-pink-50 rounded-xl shadow-sm focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all duration-200"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    </div>
                  </div>
                  {errors.image && (
                    <p className="text-red-500 text-sm mt-1">{errors.image}</p>
                  )}
                  {!imagePreview ? (
                    <div className="mt-4 flex justify-center items-center h-48 bg-gray-100 rounded-xl border border-gray-200">
                      <div className="text-gray-400">No image selected</div>
                    </div>
                  ) : (
                    <div className="mt-4 relative group">
                      <img
                        src={imagePreview}
                        alt="Event Preview"
                        className="w-full h-48 object-cover rounded-xl shadow-md transition-all duration-300 group-hover:shadow-lg"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-xl"></div>
                    </div>
                  )}
                </div>

                {/* Event Date */}
                <div className="transform transition-all duration-200">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Event Date<span className="text-pink-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="eventDate"
                      value={newEvent.eventDate}
                      onChange={handleInputChange}
                      className="w-full p-3.5 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition-all duration-200"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    </div>
                  </div>
                  {errors.eventDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.eventDate}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col md:flex-row gap-4">
              <button
                onClick={() => router.back()}
                className="px-6 py-4 border border-gray-300 text-gray-700 rounded-xl transition-all duration-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleNewEvent}
                disabled={isSaving}
                className={`flex-1 px-6 py-4 ${isSaving ? 'bg-pink-400' : 'bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700'
                  } text-white rounded-xl transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-300`}
              >
                {isSaving ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Event...
                  </div>
                ) : (
                  "Create Event"
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default NewEventPage