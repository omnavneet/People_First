"use client"
import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

const EventsPage = () => {
  const [events, setEvents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
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

    fetchEvents()
  }, [])

  // Get appropriate status styling
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

      <motion.div
        className="flex justify-between items-center gap-4 mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <motion.button
          onClick={() => router.push("/events/new")}
          className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-all shadow-md focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="font-medium">Create New Event</span>
        </motion.button>
      </motion.div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-pink-600 rounded-full animate-spin"></div>
        </div>
      ) : events.length === 0 ? (
        <motion.div
          className="text-center py-16 bg-white rounded-lg border border-gray-200 shadow-md"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-lg font-medium text-gray-700">
            No events found
          </h3>
          <p className="text-gray-500 mt-2">
            Be the first to create an event
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
          {events.map((event, index) => (
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
                    {new Date(event.createdAt).toLocaleDateString()}
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-4 w-4 mr-1 text-red-500" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                    <span className="font-medium">{event.likes || 0}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default EventsPage