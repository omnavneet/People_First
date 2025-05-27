"use client"
import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

const DashboardEvents = () => {
  const [events, setEvents] = useState(null)
  const [eventloading, setEventLoading] = useState(true)
  const router = useRouter()

  // Fetch recent community events
  useEffect(() => {
    const fetchEvents = async () => {
      setEventLoading(true)
      try {
        const response = await fetch("/api/Events", {
          method: "GET",
        })

        if (!response.ok) {
          throw new Error("Failed to fetch events")
        }

        const data = await response.json()
        const recentEvents = data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3)
        setEvents(recentEvents)
        setEventLoading(false)
      } catch (e) {
        console.log(e)
        setEventLoading(false)
      }
    }
    fetchEvents()
  }, [])

  return (
    <div>
      <motion.div
        className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 p-6 border border-gray-100"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Community Events</h2>
        </div>

        {eventloading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : events?.length > 0 ? (
          <div className="space-y-4">
            {events.map((event, index) => (
              <motion.div
                key={event._id}
                onClick={() => router.push(`/events/${event._id}`)}
                className="p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-150 border border-pink-100 hover:bg-pink-50 cursor-pointer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-800 truncate">
                    {event.title}
                  </h3>
                  <span className="text-xs font-medium bg-pink-100 text-pink-800 px-2 py-1 rounded-full">
                    {new Date(event.eventDate).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                  {event.description}
                </p>
              </motion.div>
            ))}
            <motion.button
              onClick={() => router.push("/events")}
              className="w-full text-pink-600 text-center py-2 hover:text-pink-800 text-sm font-medium"
              whileHover={{ scale: 1.02 }}
            >
              View all events →
            </motion.button>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">No community events yet</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default DashboardEvents
