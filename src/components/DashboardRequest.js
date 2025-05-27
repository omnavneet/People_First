"use client"
import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

const DashboardRequest = () => {
  const [requests, setRequests] = useState(null)
  const [requestloading, setRequestLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchRequests = async () => {
      setRequestLoading(true)
      try {
        const response = await fetch("/api/Requests", {
          method: "GET",
        })

        if (!response.ok) {
          throw new Error("Failed to fetch requests")
        }

        const data = await response.json()
        const recentRequests = data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3)
        setRequests(recentRequests)
        setRequestLoading(false)
      } catch (e) {
        console.log(e)
        setRequestLoading(false)
      }
    }
    fetchRequests()
  }, [])


  const calculateStatus = (received, goal) => {
    if (received >= goal) return "fulfilled"
    if (received < goal && received > 0) return "active"
    return "urgent"
  }

  return (
    <div>
      {/* Requests Section */}
      <motion.div
        className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 p-6 border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Support Requests</h2>
        </div>

        {requestloading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : requests?.length > 0 ? (
          <div className="space-y-4">
            {requests.map((request, index) => {
              const requestStatus = calculateStatus(
                request.donationReceived,
                request.donationGoal
              )

              return (
                <motion.div
                  key={request._id}
                  onClick={() => router.push(`/requests/${request._id}`)}
                  className={`p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-150 border border-blue-100 cursor-pointer
                    ${requestStatus === "urgent" ? "bg-red-200" : ""} 
                    ${requestStatus === "fulfilled" ? "bg-green-200" : ""} 
                    ${requestStatus === "active" ? "bg-blue-200" : ""}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-800 truncate">
                      {request.title}
                    </h3>
                    <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {Math.round(
                        (request.donationReceived / request.donationGoal) * 100
                      )}
                      % funded
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                    <motion.div
                      className="bg-blue-500 h-3 rounded-full"
                      initial={{ width: "0%" }}
                      animate={{
                        width: `${Math.min(
                          (request.donationReceived / request.donationGoal) *
                            100,
                          100
                        )}%`,
                      }}
                      transition={{ duration: 1, delay: 0.5 }}
                    ></motion.div>
                  </div>
                  <div className="flex justify-between text-sm font-medium text-gray-700">
                    <span>
                      ₹{request.donationReceived.toLocaleString()} raised
                    </span>
                    <span>Goal: ₹{request.donationGoal.toLocaleString()}</span>
                  </div>
                </motion.div>
              )
            })}
            <motion.button
              onClick={() => router.push("/requests")}
              className="w-full text-blue-600 text-center py-2 hover:text-blue-800 text-sm font-medium"
              whileHover={{ scale: 1.02 }}
            >
              View all requests →
            </motion.button>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">No support requests yet</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default DashboardRequest
