"use client"
import { useRouter } from "next/navigation"
import React, { useState, useEffect } from "react"
import { z } from "zod"

const Page = () => {
  const [newRequest, setNewRequest] = useState({
    title: "",
    description: "",
    donationGoal: 1000,
    image: "",
    status: "active",
  })
  const [userId, setUserId] = useState(null)
  const [error, setError] = useState(null)
  const router = useRouter()

  const InputSchema = z.object({
    title: z.string().min(5).max(100),
    description: z.string().min(20),
    donationGoal: z.number().positive(), // Change string to number
    image: z.string().optional(),
  })

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/Users/current", {
          method: "GET",
          credentials: "include",
        })
        const data = await response.json()
        if (data._id) {
          setUserId(data._id)
        } else {
          console.error("User not found or not authenticated")
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
    setNewRequest((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleNewRequest = async () => {
    if (!userId) {
      setError("You need to be logged in to create a request")
      return
    }

    // Validate form data
    try {
      InputSchema.parse({
        ...newRequest,
        donationGoal: parseFloat(newRequest.donationGoal), // Convert donationGoal to number
      })
      setError(null) // Reset errors if validation passes
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError(error.errors)
        return
      }
    }

    // Proceed to create request if validation is successful
    try {
      const response = await fetch("/api/Requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newRequest,
          user: userId,
        }),
      })

      if (!response.ok) {
        console.error("Error creating request:", response.statusText)
        return
      }

      const data = await response.json()
      const id = data.request._id
      router.push(`/requests/${id}`)
    } catch (error) {
      console.error("Error creating request:", error)
    }
  }

  return (
    <div className="p-4 md:p-8 lg:px-32 bg-gray-50 min-h-screen">
      <div className="w-full max-w-4xl mx-auto bg-white p-6 md:p-10 rounded-2xl shadow-xl border border-gray-100">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">
          Create New Request
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
                value={newRequest.title}
                onChange={handleInputChange}
                className="w-full p-3.5 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400"
                placeholder="Enter a title"
                required
              />
              {error && error.some((e) => e.path[0] === "title") && (
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
                value={newRequest.description}
                onChange={handleInputChange}
                rows="7"
                className="w-full p-3.5 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400"
                placeholder="Describe your request in detail..."
                required
              />
              {error && error.some((e) => e.path[0] === "description") && (
                <p className="text-red-500 text-sm mt-1">
                  {error.find((e) => e.path[0] === "description")?.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {/* Donation */}
            <div>
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
                  className="w-full p-3.5 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400 pl-8"
                  placeholder="1000"
                  required
                />
                {error && error.some((e) => e.path[0] === "donationGoal") && (
                  <p className="text-red-500 text-sm mt-1">
                    {error.find((e) => e.path[0] === "donationGoal")?.message}
                  </p>
                )}
              </div>
            </div>

            {/* Image */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Image URL (Optional)
              </label>
              <input
                type="text"
                name="image"
                value={newRequest.image}
                onChange={handleInputChange}
                className="w-full p-3.5 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Status<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  name="status"
                  value={newRequest.status}
                  onChange={handleInputChange}
                  className="w-full p-3.5 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400 appearance-none bg-white pr-10"
                  required
                >
                  <option value="active">Active</option>
                  <option value="fulfilled">Fulfilled</option>
                  <option value="urgent">Urgent</option>
                </select>
                {error && error.some((e) => e.path[0] === "status") && (
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
            onClick={handleNewRequest}
            className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
          >
            Create Request
          </button>
        </div>
      </div>
    </div>
  )
}

export default Page
