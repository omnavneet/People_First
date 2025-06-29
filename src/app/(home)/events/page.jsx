"use client"
import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

const EventsPage = () => {
  const [events, setEvents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentView, setCurrentView] = useState("all")
  const [currentUser, setCurrentUser] = useState(null)
  const router = useRouter()

  // Fetch current user and events on component mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await getCurrentUser()
        setCurrentUser(user)
      } catch (e) {
        console.log("Error fetching current user:", e)
      }
    }

    const fetchEvents = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("/api/Events", {
          method: "GET",
        })
        const data = await response.json()
        const recentEvents = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
        setEvents(recentEvents)
        setIsLoading(false)
      } catch (e) {
        console.log(e)
        setIsLoading(false)
      }
    }

    fetchCurrentUser()
    fetchEvents()
  }, [])

  // Function to fetch current user
  const getCurrentUser = () => {
    return fetch("/api/Users/current", {
      method: "GET",
    })
      .then((res) => res.json())
      .catch((e) => {
        console.log(e)
        return null
      })
  }

  const filteredEvents = events.filter((event) => {
    if (currentView === "all") return true
    if (currentView === "your" && currentUser) {
      return event.user === currentUser._id
    }
    return false
  })

  // Get status
  const getStatusStyle = (status) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-200 text-blue-800"
      case "completed":
        return "bg-green-200 text-green-800"
      case "cancelled":
        return "bg-red-200 text-red-800"
      default:
        return "bg-gray-200 text-gray-800"
    }
  }

  return (
    <div className="py-8 w-auto bg-pink-50 min-h-screen">
      <motion.header
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Community Events
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Browse and join upcoming events in your community.
        </p>
      </motion.header>

      <div className="max-w-6xl mx-auto px-4">
        {/* Top Action Bar */}
        <motion.div
          className="flex flex-wrap gap-4 mb-6 justify-between"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* Event Filter Button */}
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              onClick={() => setCurrentView("all")}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${currentView === "all"
                ? "bg-pink-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
                } border border-gray-200 focus:z-10 focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50`}
            >
              All Events
            </button>
            <button
              type="button"
              onClick={() => setCurrentView("your")}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${currentView === "your"
                ? "bg-pink-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
                } border border-gray-200 focus:z-10 focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50`}
            >
              Your Events
            </button>
          </div>

          {/* Create New Event Button */}
          <motion.button
            onClick={() => router.push("/events/new")}
            className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-all shadow-md focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="font-medium">Create New Event</span>
          </motion.button>
        </motion.div>

        {/* Events Display */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-pink-600 rounded-full animate-spin"></div>
          </div>
        ) : filteredEvents.length === 0 ? (
          <motion.div
            className="text-center py-16 bg-white rounded-lg border border-gray-200 shadow-md"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-lg font-medium text-gray-700">
              {currentView === "all" ? "No events found" : "You haven't created any events yet"}
            </h3>
            <p className="text-gray-500 mt-2">
              {currentView === "all" ? "Be the first to create an event" : "Create your first event now"}
            </p>
            <motion.button
              onClick={() => router.push("/events/new")}
              className="mt-4 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Create Event
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event._id}
                onClick={() => router.push(`/events/${event._id}`)}
                className="bg-white shadow-lg rounded-lg overflow-hidden border border-pink-100 hover:shadow-xl transition-all cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (index % 6) }}
                whileHover={{ scale: 1.02 }}
              >
                {/* Image Section */}
                <div className="h-48 bg-gray-200 relative overflow-hidden">
                  {event.image ? (
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>

                {/* Event Details */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-900 truncate pr-2">
                      {event.title}
                    </h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusStyle(event.status)}`}
                    >
                      {event.status}
                    </span>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {new Date(event.eventDate).toLocaleDateString()}
                    </div>

                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-green-500 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <span className="text-gray-700">{event.volunteers?.length || 0}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default EventsPage