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
  const [isVolunteering, setIsVolunteering] = useState(false)
  const [formattedEventDate, setFormattedEventDate] = useState("")
  const [comment, setComment] = useState("")
  const [comments, setComments] = useState([])

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

  const handleVolunteerToggle = async () => {
    console.log("Volunteer button clicked")
    if (!userID) return

    try {
      const response = await fetch(`/api/Events/${id}/volunteer`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: userID }),
      })

      if (response.ok) {
        const updatedEvent = await response.json()
        setIsVolunteering(updatedEvent.volunteers.some(user => user._id === userID || user === userID))
        setEvent(updatedEvent)
      }
    } catch (error) {
      console.error("Error toggling volunteer status:", error)
    }
  }

  const handlePostComment = async (e) => {
    e.preventDefault()
    if (!userID || !comment.trim()) return

    try {
      const response = await fetch(`/api/Events/${id}/comments`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: userID,
          content: comment
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setComments(data.comments)
        setComment("")
      }
    } catch (error) {
      console.error("Error posting comment:", error)
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

  useEffect(() => {
    if (event?.eventDate) {
      try {
        const date = new Date(Number(event.eventDate));
        setFormattedEventDate(date.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }));
      } catch (error) {
        console.log("Error formatting date:", error);
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
      setComments(data.comments || [])

      if (userID && data.volunteers) {
        const isUserVolunteering = data.volunteers.some(
          user => (typeof user === 'object' ? user._id === userID : user === userID)
        )
        setIsVolunteering(isUserVolunteering)
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

        {/* Comments Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <h2 className="text-xl font-semibold mb-4">Comments</h2>

          {/* Comment Form */}
          {userID && (
            <form onSubmit={handlePostComment} className="mb-6">
              <div className="flex">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-grow p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows="2"
                />
                <button
                  type="submit"
                  disabled={!comment.trim()}
                  className="bg-indigo-600 text-white px-4 rounded-r-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-300"
                >
                  Post
                </button>
              </div>
            </form>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {comments && comments.length > 0 ? (
              comments.map((comment, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center mb-2">
                    <img
                      src={comment.user?.profilePicture || "/placeholder-user.png"}
                      alt="User"
                      className="w-8 h-8 rounded-full mr-2"
                    />
                    <div>
                      <p className="font-medium text-gray-800">
                        {comment.user?.name || "Anonymous"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">No comments yet. Be the first to comment!</p>
            )}
          </div>
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
              <span className="text-gray-700">{event.volunteers?.length || 0} volunteers</span>
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
              onClick={handleVolunteerToggle}
              className={`py-3 w-full text-white rounded-lg transition-all ${isVolunteering
                ? "bg-green-500 hover:bg-green-600"
                : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={!userID}
            >
              {isVolunteering ? "Cancel Volunteering" : "Volunteer"}
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
          className="mt-3 px-3 py-3 rounded-lg bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 shadow-sm"
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
            <p className="text-gray-800 text-lg">
              {formattedEventDate}
            </p>
          </div>
        </motion.div>

        {/* Volunteers Section */}
        <motion.div
          className="mt-3 px-3 py-3 rounded-lg bg-gradient-to-br from-green-50 to-teal-50 border border-green-100 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
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
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              Volunteers
            </h2>
          </div>

          <div className="relative pl-4 border-l-2 border-green-200">
            {event.volunteers && event.volunteers.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {event.volunteers.map((volunteer, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-white px-3 py-1 rounded-full border border-green-200"
                  >
                    <img
                      src={volunteer.profilePicture || "/placeholder-user.png"}
                      alt={volunteer.name}
                      className="w-6 h-6 rounded-full mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {volunteer.name || "Volunteer"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No volunteers yet. Be the first to volunteer!</p>
            )}
          </div>
        </motion.div>

        {/*AI analysis*/}
        <motion.div
          className="mt-3 px-3 py-5 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="white"
                className="w-5 h-5"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Analysis
            </h2>
          </div>

          {event?.eventAnalysis ? (
            <>
              <div className="flex items-center mb-3">
                <div
                  className={`px-3 py-1 rounded-full text-white text-sm font-medium ${event.eventAnalysis.judgment === "Trustworthy"
                    ? "bg-green-500"
                    : event.eventAnalysis.judgment === "Needs Review"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                    }`}
                >
                  {event.eventAnalysis.judgment}
                </div>
              </div>

              <div className="relative pl-4 border-l-2 border-purple-200">
                <p className="text-gray-800 italic text-lg">
                  {event.eventAnalysis.reason}
                </p>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-4">
              <div className="w-10 h-10 border-t-4 border-blue-500 border-solid rounded-full animate-spin mb-3"></div>
              <p className="text-gray-600">Analyzing this request...</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default EventDetailPage