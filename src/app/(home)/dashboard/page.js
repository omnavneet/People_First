"use client"
import React, { useEffect, useState } from "react"

const Home = () => {
  const [user, setUser] = useState(null)
  const [events, setEvents] = useState(null)
  const [requests, setRequests] = useState(null)

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
        .slice(0, 5)
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
        .slice(0, 5)
      setRequests(recentRequests)
    }
    fetchRequests()
  }, [])

  const id = user?._id
  const name = user?.name
  const TotalDonationReceived = requests?.reduce(
    (total, request) => total + (request.donationReceived || 0),
    0
  )

  return (
    <div className="flex flex-col justify-center py-8 px-4 sm:px-6 md:px-8 lg:px-12">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Welcome, {name}!
        </h1>
        <p className="text-md text-gray-500">Your dashboard at a glance.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Recent Events
          </h2>
          <ul className="space-y-3">
            {events?.map((event) => (
              <li
                key={event._id}
                className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors duration-150"
              >
                <h3 className="text-lg font-medium text-gray-800">
                  {event.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {event.description}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Recent Requests
          </h2>
          <ul className="space-y-3">
            {requests?.map((request) => (
              <li
                key={request._id}
                className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors duration-150"
              >
                <h3 className="text-lg font-medium text-gray-800">
                  {request.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {request.description}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-gradient-to-br from-green-400 to-green-500 rounded-xl shadow-lg p-6 flex flex-col justify-center items-center text-white hover:shadow-xl transition-shadow duration-200">
          <h2 className="text-xl font-semibold mb-3">Money Raised</h2>
          <p className="text-5xl font-bold">₹ {TotalDonationReceived}</p>
        </div>
      </div>
    </div>
  )
}

export default Home
