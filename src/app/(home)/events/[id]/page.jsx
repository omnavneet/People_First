"use client"
import { useParams, useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"

const EventDetailPage = () => {
  const { id } = useParams()
  const router = useRouter()
  const [userID, setUserID] = useState(null)
  const [event, setEvent] = useState({})
  const [eventOrganizerID, setEventOrganizerID] = useState(null)
  const [userName, setUserName] = useState("Anonymous")
  const [userImage, setUserImage] = useState("")
  const [isLiked, setIsLiked] = useState(false)
  const [formattedEventDate, setFormattedEventDate] = useState("")

  const handleShare = async () => {
    try {
      await navigator.share({
        title: event.title,
        text: event.description?.substring(0, 100) + "...",
        url: window.location.href,
      })
    } catch (error) {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const handleLikeToggle = async () => {
    console.log("Like button clicked")
    if (!userID) return

    try {
      const response = await fetch(`/api/Events/${id}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: userID }),
      })

      if (response.ok) {
        const updatedEvent = await response.json()
        setIsLiked(updatedEvent.likedBy.some(user => user._id === userID || user === userID))
        setEvent(updatedEvent)
      }
    } catch (error) {
      console.error("Error toggling like:", error)
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/Users/current`)
        const data = await response.json()
        setUserID(data._id)
      } catch (e) {
        console.error("Error fetching user:", e)
      }
    }
    fetchUser()
  }, [])

  // Format the event date whenever the event data changes
  useEffect(() => {
    if (event?.eventDate) {
      try {
        // Handle the eventDate as a timestamp (number)
        const date = new Date(Number(event.eventDate));
        
        // Check if date is valid
        if (!isNaN(date.getTime())) {
          setFormattedEventDate(date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }));
        } else {
          setFormattedEventDate("Date not available");
        }
      } catch (error) {
        console.error("Error formatting date:", error);
        setFormattedEventDate("Date format error");
      }
    } else {
      setFormattedEventDate("Date not available");
    }
  }, [event]);

  const fetchEventData = async () => {
    if (!id) return
    try {
      const response = await fetch(`/api/Events/${id}`, {
        method: "GET",
      })
      const data = await response.json()

      console.log(data)

      setEvent(data)
      setEventOrganizerID(data?.user?._id)

      if (userID && data.likedBy) {
        const hasLiked = data.likedBy.some(
          user => (typeof user === 'object' ? user._id === userID : user === userID)
        )
        setIsLiked(hasLiked)
      }
    } catch (e) {
      console.error("Error fetching event:", e)
    }
  }

  useEffect(() => {
    if (userID) {
      fetchEventData()
    }
  }, [id, userID])

  useEffect(() => {
    if (!userID) {
      fetchEventData()
    }
  }, [id])

  const handleDelete = async () => {
    if (eventOrganizerID !== userID) {
      return
    }

    try {
      await fetch(`/api/Events/${id}`, {
        method: "DELETE",
      })
      router.push("/events")
    } catch (e) {
      console.error("Error deleting event:", e)
    }
  }

  useEffect(() => {
    if (!eventOrganizerID) return

    const fetchUserName = async () => {
      try {
        const response = await fetch(`/api/Users/${eventOrganizerID}`, {
          method: "GET",
        })
        const data = await response.json()
        setUserName(data.name)
        setUserImage(data.profilePicture)
      } catch (e) {
        console.error("Error fetching user name:", e)
      }
    }

    fetchUserName()
  }, [eventOrganizerID])

  // status color
  const getStatusColor = (status) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-500"
      case "completed":
        return "bg-green-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="grid md:grid-cols-3 gap-4 py-6">
      {/* Left Column - Image and Details */}
      <div className="md:col-span-2">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-4"
        >
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {event.title}
          </h1>
          <div
            className={`inline-block px-2 py-1 rounded-lg text-sm text-white ${getStatusColor(
              event.status
            )}`}
          >
            {event.status?.toUpperCase()}
          </div>
        </motion.div>

        {event.image ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full aspect-video bg-gray-100 rounded-lg overflow-hidden"
          >
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full aspect-video flex items-center justify-center text-gray-400 bg-gray-100 rounded-lg"
          >
          </motion.div>
        )}

        {/* Organizer Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4 flex items-center space-x-3"
        >
          <img
            src={userImage || "/placeholder-user.png"}
            alt="Organizer"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-semibold text-gray-800">Organized by</p>
            <p className="text-sm text-gray-600">{userName}</p>
          </div>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6"
        >
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-gray-700 whitespace-pre-line">
            {event.description}
          </p>
        </motion.div>
      </div>

      {/* Right Column - Event Details */}
      <div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-lg rounded-lg p-6 sticky top-4"
        >
          {/* Event Meta Info */}
          <div className="mb-6">
            <div className="flex justify-between mb-4">
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-indigo-500 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-gray-700">
                  Created: {new Date(event.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>

            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-red-500 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-700">{event.likes || 0} likes</span>
            </div>
          </div>

          {/* Action Buttons */}
          <motion.div
            className="text-center flex flex-col items-center space-y-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <motion.button
              onClick={handleShare}
              className="py-3 w-full bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Share
            </motion.button>

            <motion.button
              onClick={handleLikeToggle}
              className={`py-3 w-full text-white rounded-lg transition-all ${isLiked
                ? "bg-red-500 hover:bg-red-600"
                : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={!userID}
            >
              {isLiked ? "Unlike" : "Like"}
            </motion.button>

            {userID === eventOrganizerID && (
              <>
                <motion.button
                  onClick={() => router.push(`/events/edit/${id}`)}
                  className="py-3 w-full bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Edit Event
                </motion.button>

                <motion.button
                  onClick={handleDelete}
                  className="py-3 w-full bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Delete Event
                </motion.button>
              </>
            )}
          </motion.div>
        </motion.div>

        {/* Event Date */}
        <motion.div
          className="mt-3 px-3 py-5 rounded-lg bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Event Date
            </h2>
          </div>

          <div className="relative pl-4 border-l-2 border-purple-200">
            <p className="text-gray-800 text-[17px]">
              {formattedEventDate}
            </p>
          </div>
        </motion.div>
        
        {/* Event Status Section */}
        <motion.div
          className="mt-3 px-3 py-5 rounded-lg bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="white"
                className="w-5 h-5"
              >
                <path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Event Status
            </h2>
          </div>

          <div className="relative pl-4 border-l-2 border-purple-200">
            <p className="text-gray-800 text-[17px]">
              {event.status === "upcoming" &&
                "This event is coming soon! Don't miss out."}
              {event.status === "completed" &&
                "This event has already taken place."}
              {event.status === "cancelled" &&
                "Unfortunately, this event has been cancelled."}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default EventDetailPage