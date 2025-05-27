"use client"
import { useRouter } from "next/navigation"
import React, { useState, useEffect } from "react"
import { z } from "zod"

const Page = () => {
  const [newRequest, setNewRequest] = useState({
    title: "",
    description: "",
    donationGoal: 10000,
    image: "",
    status: "active",
  })
  const [imagePreview, setImagePreview] = useState(null)
  const [userId, setUserId] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const router = useRouter()

  const InputSchema = z.object({
    title: z.string().min(5).max(100),
    description: z.string().min(20),
    donationGoal: z.number().positive(),
    image: z.string().min(1),
  })

  // Fetch current user ID
  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("/api/Users/current", {
          method: "GET",
          credentials: "include",
        })
        const data = await response.json()
        if (data._id) {
          setUserId(data._id)
        } else {
          console.log("User not found or not authenticated")
          setError("User not found or not authenticated")
        }
      } catch (error) {
        console.log("Error fetching user:", error)
        setError("Error fetching user data")
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
    setNewRequest((prev) => ({
      ...prev,
      [name]: value,
    }))
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
          setNewRequest((prev) => ({
            ...prev,
            image: reader.result,
          }))
          setError(null)
        }
        reader.readAsDataURL(file)
      }, 600)

      return () => clearTimeout(loadingTimeout)
    }
  }

  // Handle new request submission
  const handleNewRequest = async () => {
    if (!userId) return

    try {
      InputSchema.parse({
        ...newRequest,
        donationGoal: parseFloat(newRequest.donationGoal),
      })
      setError(null)
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError(error.errors)
        console.log("Validation error:", error.errors)
        return
      }
    }

    setIsSaving(true)

    try {
      const response = await fetch("/api/Requests", {
        method: "POST",
        body: JSON.stringify({
          ...newRequest,
          donationGoal: parseFloat(newRequest.donationGoal),
          user: userId,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Request creation failed: ${errorText}`)
      }

      setShowSuccessToast(true)

      setTimeout(() => {
        router.push(`/requests`)
      }, 1500)
    } catch (error) {
      console.log("Error creating request:", error)
      setError(error.message)
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
        </div>
        <div className="space-y-6">
          <div>
            <div className="h-6 bg-gray-200 w-1/3 rounded mb-2"></div>
            <div className="h-12 bg-gray-200 rounded-xl"></div>
          </div>
          <div>
            <div className="h-6 bg-gray-200 w-1/4 rounded mb-2"></div>
            <div className="h-12 bg-gray-200 rounded-xl"></div>
          </div>
          <div className="h-48 bg-gray-200 rounded-xl mt-4"></div>
        </div>
      </div>
      <div className="h-14 bg-gray-200 rounded-xl mt-8"></div>
    </div>
  )

  return (
    <div className="p-4 md:p-8 lg:px-32 bg-gradient-to-b from-green-50 to-white min-h-screen">
      <div className="w-full max-w-4xl mx-auto p-6 md:p-10 bg-white rounded-2xl shadow-xl border border-gray-100 transition-all duration-300 hover:shadow-2xl">
        {showSuccessToast && (
          <div className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 animate-fade-in-down">
            Request created successfully!
          </div>
        )}

        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center relative">
          Create New Request
        </h2>

        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="space-y-6">
                {/* Title */}
                <div className="transform transition-all duration-200">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Title<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={newRequest.title}
                    onChange={handleInputChange}
                    className="w-full p-3.5 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-red-300 focus:border-red-300 transition-all duration-200"
                    placeholder="Enter a title"
                    required
                  />
                  {error &&
                    error.some &&
                    error.some((e) => e.path[0] === "title") && (
                      <p className="text-red-500 text-sm mt-1">
                        {error.find((e) => e.path[0] === "title")?.message}
                      </p>
                    )}
                </div>

                {/* Description */}
                <div className="transform transition-all duration-200">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Description<span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={newRequest.description}
                    onChange={handleInputChange}
                    rows="7"
                    className="w-full p-3.5 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-green-300 focus:border-green-300 transition-all duration-200"
                    placeholder="Describe your request in detail..."
                    required
                  />
                  {error &&
                    error.some &&
                    error.some((e) => e.path[0] === "description") && (
                      <p className="text-red-500 text-sm mt-1">
                        {
                          error.find((e) => e.path[0] === "description")
                            ?.message
                        }
                      </p>
                    )}
                </div>
              </div>

              <div className="space-y-6">
                {/* Donation */}
                <div className="transform transition-all duration-200">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Donation Goal (₹)<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-500">
                      ₹
                    </span>
                    <input
                      type="number"
                      name="donationGoal"
                      min="1"
                      value={newRequest.donationGoal}
                      onChange={handleInputChange}
                      className="w-full p-3.5 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-green-300 focus:border-green-300 transition-all duration-200 pl-8"
                      placeholder="1000"
                      required
                    />
                    {error &&
                      error.some &&
                      error.some((e) => e.path[0] === "donationGoal") && (
                        <p className="text-red-500 text-sm mt-1">
                          {
                            error.find((e) => e.path[0] === "donationGoal")
                              ?.message
                          }
                        </p>
                      )}
                  </div>
                </div>

                {/* Image Upload */}
                <div className="transform transition-all duration-200">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Request Image <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/gif"
                      onChange={handleImageUpload}
                      className="w-full p-3.5 border border-dashed border-green-300 bg-green-50 rounded-xl shadow-sm focus:ring-2 focus:ring-green-300 focus:border-green-300 transition-all duration-200"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"></div>
                  </div>
                  {error &&
                    error.some &&
                    error.some((e) => e.path[0] === "image") && (
                      <p className="text-red-500 text-sm mt-1">
                        Image cannot be empty
                      </p>
                    )}

                  {/* Image Preview */}
                  {!imagePreview ? (
                    <div className="mt-4 flex justify-center items-center h-48 bg-gray-100 rounded-xl border border-gray-200">
                      <div className="text-gray-400">No image selected</div>
                    </div>
                  ) : (
                    <div className="mt-4 relative group">
                      <img
                        src={imagePreview}
                        alt="Request Preview"
                        className="w-full h-48 object-cover rounded-xl shadow-md transition-all duration-300 group-hover:shadow-lg"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-xl"></div>
                    </div>
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
                onClick={handleNewRequest}
                disabled={isSaving}
                className={`flex-1 px-6 py-4 ${isSaving
                    ? "bg-green-400"
                    : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  } text-white rounded-xl transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-300`}
              >
                {isSaving ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating Request...
                  </div>
                ) : (
                  "Create Request"
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Page
