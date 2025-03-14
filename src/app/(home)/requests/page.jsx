"use client"
import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

const Page = () => {
  const [requests, setRequests] = useState([])
  const router = useRouter() 

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch("/api/Requests", {
          method: "GET",
        })
        const data = await response.json()
        const recentRequests = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
        setRequests(recentRequests)
      } catch (error) {
        console.error("Error fetching requests:", error)
      }
    }

    fetchRequests()
  }, [])

  return (
    <div className="p-8 md:px-32">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-800">Requests</h1>
        <button
          onClick={() => router.push("/requests/new")}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
        >
          Create New Request
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.map((request) => (
          <div
            key={request._id}
            className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
          >
            <h3 className="text-2xl font-bold text-gray-900 truncate">
              {request.title}
            </h3>
            <p className="text-gray-600 mt-3 line-clamp-3">
              {request.description}
            </p>
            <div className="mt-4 space-y-1 text-sm text-gray-500">
              <p>
                <span className="font-semibold">Donation Goal:</span> ₹
                {request.donationGoal}
              </p>
              <p>
                <span className="font-semibold">Donations Received:</span> ₹
                {request.donationReceived}
              </p>
              <p>
                <span className="font-semibold">Status:</span> {request.status}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Page
