"use client"
import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

const Page = () => {
  const [requests, setRequests] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchRequests = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("/api/Requests", {
          method: "GET",
        })
        const data = await response.json()
        const recentRequests = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
        setRequests(recentRequests)
        setIsLoading(false)
      } catch (e) {
        console.log(e)
        setIsLoading(false)
      }
    }

    fetchRequests()
  }, [])

  // Calculate donation progress percentage
  const getProgressPercentage = (received, goal) => {
    const percentage = (received / goal) * 100
    return Math.min(percentage, 100) // Cap at 100%
  }

  return (
    <div className="px-2 py-8 max-w-6xl mx-auto bg-green-50 min-h-screen">
      <motion.header
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Donation Requests
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Browse and support ongoing donation requests.
        </p>
      </motion.header>

      <motion.div
        className="flex justify-between items-center gap-4 mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <motion.button
          onClick={() => router.push("/requests/new")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="font-medium">Create New Request</span>
        </motion.button>
      </motion.div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      ) : requests.length === 0 ? (
        <motion.div
          className="text-center py-16 bg-white rounded-lg border border-gray-200 shadow-md"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-lg font-medium text-gray-700">
            No donation requests found
          </h3>
          <p className="text-gray-500 mt-2">
            Be the first to create a donation request
          </p>
          <motion.button
            onClick={() => router.push("/requests/new")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Create Request
          </motion.button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {requests.map((request, index) => {
            const progressPercentage = getProgressPercentage(
              request.donationReceived,
              request.donationGoal
            )

            return (
              <motion.div
                key={request._id}
                onClick={() => router.push(`/requests/${request._id}`)}
                className="bg-white shadow-lg rounded-lg overflow-hidden border border-blue-100 hover:shadow-xl transition-all cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (index % 6) }}
                whileHover={{ scale: 1.02 }}
              >
                {/* Image Section */}
                <div className="h-48 bg-gray-200 relative overflow-hidden">
                  {request.image ? (
                    <img
                      src={request.image}
                      alt={request.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>

                {/* Request Details */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-900 truncate pr-2">
                      {request.title}
                    </h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${request.status === "active"
                          ? "bg-green-100 text-green-800"
                          : request.status === "fulfilled"
                            ? "bg-blue-100 text-blue-800"
                            : request.status === "urgent"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                    >
                      {request.status}
                    </span>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">
                        ₹{request.donationReceived}
                      </span>
                      <span className="text-gray-500">
                        Goal: ₹{request.donationGoal}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <motion.div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${progressPercentage}%` }}
                        initial={{ width: "0%" }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{
                          duration: 1,
                          delay: 0.5 + 0.1 * (index % 6),
                        }}
                      ></motion.div>
                    </div>
                    <div className="text-right mt-1 text-xs text-gray-500">
                      {Math.round(progressPercentage)}% funded
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
                    {request.createdAt && (
                      <span>
                        Created{" "}
                        {new Date(request.createdAt).toLocaleDateString()}
                      </span>
                    )}
                    <span className="text-blue-600 font-medium">
                      View Details →
                    </span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Page
