"use client"
import { useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"

const Home = () => {
  const [user, setUser] = useState(null)
  const [events, setEvents] = useState(null)
  const [requests, setRequests] = useState(null)

  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch("/api/Users/current", {
        method: "GET",
      })
      const data = await response.json()
      setUser(data)
    }
    fetchUser()
  }, [])

  useEffect(() => {
    const fetchEvents = async () => {
      const response = await fetch("/api/Events", {
        method: "GET",
      })
      const data = await response.json()
      const recentEvents = data
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3)
      setEvents(recentEvents)
    }
    fetchEvents()
  }, [])

  useEffect(() => {
    const fetchRequests = async () => {
      const response = await fetch("/api/Requests", {
        method: "GET",
      })
      const data = await response.json()
      const recentRequests = data
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3)
      setRequests(recentRequests)
    }
    fetchRequests()
  }, [])

  const name = user?.name
  const TotalDonationReceived = requests?.reduce(
    (total, request) => total + (request.donationReceived || 0),
    0
  )

  return (
    <div className="flex flex-col justify-center py-5 px-4 sm:px-6 md:px-8 lg:px-12">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Welcome, {name}!
        </h1>
        <p className="text-md text-gray-500">Your dashboard at a glance.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">

        <div className="bg-[#ff9696] rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200 p-4 border border-gray-200 ">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl font-bold text-gray-900">
              Recent Events
            </h2>
            <button
              onClick={() => router.push("/events/new")}
              className="py-3 px-4 bg-[#ff4646] text-white text-lg rounded-lg hover:bg-[#c02b2b] transition-all shadow-md hover:shadow-lg"
            >
              Add Event
            </button>
          </div>

          {events?.length > 0 ? (
            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event._id}
                  className="p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-150 hover:bg-[#ffc2c2] overflow-hidden"
                >
                  <h3 className="text-lg font-semibold text-gray-800 truncate">
                    {event.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {event.description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-sm">No recent events found.</p>
          )}
        </div>

        <div className="bg-[#709bd783] rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200 p-4 border border-gray-200">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl font-bold text-gray-900">
              Recent Requests
            </h2>
            <button
              onClick={() => router.push("/requests/new")}
              className="py-3 px-4 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
            >
              Create New Request
            </button>
          </div>

          {requests?.length > 0 ? (
            <div className="space-y-4">
              {requests.map((request) => (
                <div
                  key={request._id}
                  className="p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-150 bg-[#709bd7] overflow-hidden"
                >
                  <h3 className="text-lg font-semibold text-gray-800 truncate mb-1">
                    {request.title}
                  </h3>

                  <div className="w-full bg-gray-200 rounded-full h-5">
                    <div
                      className="bg-green-500 h-5 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(
                          (request.donationReceived / request.donationGoal) *
                            100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                  <div className="mt-2 flex justify-between text-sm font-medium text-gray-700">
                    <span>
                      ₹{request.donationReceived.toLocaleString()} raised
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-sm">No recent requests found.</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-1">
          <div className="bg-gradient-to-br bg-green-500 rounded-xl shadow-lg p-6 flex flex-col justify-center items-center text-white hover:shadow-xl transition-shadow duration-200 h-2/5">
            <h2 className="text-xl font-semibold mb-3">Money Raised</h2>
            <p className="text-5xl font-bold">₹ {TotalDonationReceived}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
