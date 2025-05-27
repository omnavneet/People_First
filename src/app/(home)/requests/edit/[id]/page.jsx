"use client"

import { useRouter, useParams } from "next/navigation"
import React, { useState, useEffect } from "react"
import { z } from "zod"

const EditRequestPage = () => {
  const [request, setRequest] = useState({
    title: "",
    description: "",
    donationGoal: 0,
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
  const { id } = useParams()

  const InputSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters").max(100),
    description: z
      .string()
      .min(20, "Description must be at least 20 characters"),
    donationGoal: z.number().positive("Donation goal must be positive"),
    image: z.string(),
    status: z.enum(["active", "fulfilled", "urgent"]),
  })


  // Fetch current user ID
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
        console.log("Error fetching user:", error)
        setError("Error fetching user")
      }
    }

    fetchUser()
  }, [])


  // Fetch request data
  useEffect(() => {
    const fetchRequest = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/Requests/${id}`)
        const data = await response.json()

        setTimeout(() => {
          setRequest({
            title: data.title,
            description: data.description,
            donationGoal: data.donationGoal,
            image: data.image,
            status: data.status || "active",
          })
          setImagePreview(data.image)
          setIsLoading(false)
        }, 800)
      } catch (e) {
        console.log("Error fetching request data:", e)
        setError("Failed to load request details.")
        setIsLoading(false)
      }
    }

    if (id) fetchRequest()
  }, [id])


  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setRequest((prev) => ({
      ...prev,
      [name]: name === "donationGoal" ? parseFloat(value) : value,
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
          setRequest((prev) => ({
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


  // Handle request update
  const handleUpdateRequest = async () => {
    if (!userId) return

    try {
      InputSchema.parse(request)
      setError(null)
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError(error.errors)
        return
      }
    }

    setIsSaving(true)

    try {
      const response = await fetch(`/api/Requests/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          ...request,
          user: userId,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText)
      }

      setShowSuccessToast(true)

      // Delay navigation
      setTimeout(() => {
        router.push(`/requests/${id}`)
      }, 1500)
    } catch (error) {
      setError(error.message || "Request update failed")
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
            Request updated successfully!
          </div>
        )}

        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center relative">
          Edit Request
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
                    value={request.title}
                    onChange={handleInputChange}
                    className="w-full p-3.5 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-green-300 focus:border-green-300 transition-all duration-200"
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
                    value={request.description}
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
                      value={request.donationGoal}
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

                {/* Status */}
                <div className="transform transition-all duration-200">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Status<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="status"
                      value={request.status}
                      onChange={handleInputChange}
                      className="w-full p-3.5 border border-gray-300 rounded-xl shadow-sm appearance-none focus:ring-2 focus:ring-green-300 focus:border-green-300 transition-all duration-200"
                      required
                    >
                      <option value="active">Active</option>
                      <option value="fulfilled">Fulfilled</option>
                      <option value="urgent">Urgent</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    {error &&
                      error.some &&
                      error.some((e) => e.path[0] === "status") && (
                        <p className="text-red-500 text-sm mt-1">
                          {error.find((e) => e.path[0] === "status")?.message}
                        </p>
                      )}
                  </div>
                </div>

                {/* Image Upload */}
                <div className="transform transition-all duration-200">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Image
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
                onClick={handleUpdateRequest}
                disabled={isSaving}
                className={`flex-1 px-6 py-4 ${
                  isSaving
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
                    Updating Request...
                  </div>
                ) : (
                  "Update Request"
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default EditRequestPage
