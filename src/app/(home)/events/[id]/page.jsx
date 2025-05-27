"use client"
import { useParams, useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"

const LoadingSkeleton = ({ className }) => (
  <div
    className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] ${className}`}
  >
    <div className="animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
  </div>
)

// Get Status Component
const Status = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return {
          color: "bg-gradient-to-r from-green-500 to-emerald-600",
          text: "COMPLETED",
        }
      case "cancelled":
        return {
          color: "bg-gradient-to-r from-red-500 to-rose-600",
          text: "CANCELLED",
        }
      default:
        return {
          color: "bg-gradient-to-r from-blue-500 to-indigo-600",
          text: "UPCOMING",
        }
    }
  }

  const config = getStatusConfig(status)

  return (
    <motion.div
      className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold text-white shadow-lg ${config.color}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {config.text}
    </motion.div>
  )
}

const EventDetailPage = () => {
  const { id } = useParams()
  const router = useRouter()
  const [userID, setUserID] = useState(null)
  const [event, setEvent] = useState({})
  const [eventOrganizerID, setEventOrganizerID] = useState(null)
  const [userName, setUserName] = useState("Anonymous")
  const [userEmail, setUserEmail] = useState("")
  const [userImage, setUserImage] = useState("")
  const [isVolunteering, setIsVolunteering] = useState(false)
  const [formattedEventDate, setFormattedEventDate] = useState("")
  const [comment, setComment] = useState("")
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)

  // Share functionality
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

  // Volunteer toggle
  const handleVolunteerToggle = async () => {
    console.log("Volunteer button clicked")
    if (!userID) return

    try {
      const response = await fetch(`/api/Events/${id}/volunteer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: userID }),
      })

      if (response.ok) {
        const updatedEvent = await response.json()
        setIsVolunteering(
          updatedEvent.volunteers.some(
            (user) => user._id === userID || user === userID
          )
        )
        setEvent(updatedEvent)
      }
    } catch (error) {
      console.error("Error toggling volunteer status:", error)
    }
  }

  // Post comment
  const handlePostComment = async (e) => {
    e.preventDefault()
    if (!userID || !comment.trim()) return

    try {
      const response = await fetch(`/api/Events/${id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userID,
          content: comment,
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

  // Fetch current user ID
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

  // Format event date
  useEffect(() => {
    if (event?.eventDate) {
      try {
        const date = new Date(Number(event.eventDate))
        setFormattedEventDate(
          date.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        )
      } catch (error) {
        console.log("Error formatting date:", error)
        setFormattedEventDate("Date format error")
      }
    } else {
      setFormattedEventDate("Date not available")
    }
  }, [event])

  // Fetch event data
  const fetchEventData = async () => {
    if (!id) return

    setLoading(true)
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
        const isUserVolunteering = data.volunteers.some((user) =>
          typeof user === "object" ? user._id === userID : user === userID
        )
        setIsVolunteering(isUserVolunteering)
      }
    } catch (e) {
      console.error("Error fetching event:", e)
    } finally {
      setLoading(false)
    }
  }

  // Fetch event data when userID changes or on initial load
  useEffect(() => {
    if (userID) {
      fetchEventData()
    }
  }, [id, userID])

  // Fetch event data when the page loads without a userID
  useEffect(() => {
    if (!userID) {
      fetchEventData()
    }
  }, [id])

  // Handle delete event
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

  // Fetch user name and email
  useEffect(() => {
    if (!eventOrganizerID) return

    const fetchUserName = async () => {
      try {
        const response = await fetch(`/api/Users/${eventOrganizerID}`, {
          method: "GET",
        })
        const data = await response.json()
        setUserName(data.name)
        setUserEmail(data.email)
        setUserImage(data.profilePicture)
      } catch (e) {
        console.error("Error fetching user name:", e)
      }
    }

    fetchUserName()
  }, [eventOrganizerID])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <LoadingSkeleton className="h-8 w-3/4 rounded-lg" />
              <LoadingSkeleton className="h-6 w-1/4 rounded-full" />
              <LoadingSkeleton className="h-64 w-full rounded-2xl" />
              <LoadingSkeleton className="h-32 w-full rounded-xl" />
            </div>
            <div className="space-y-4">
              <LoadingSkeleton className="h-80 w-full rounded-2xl" />
              <LoadingSkeleton className="h-32 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-3 gap-4 py-6">
      {/* Left Column - Image and Details */}
      <div className="md:col-span-2 px-2">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-4"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            {event.title}
          </h1>
          <Status status={event.status} />
        </motion.div>

        {/* Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-80 mx-auto"
        >
          <div className="w-full h-60 bg-gray-100 rounded-xl overflow-hidden shadow-lg">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        </motion.div>

        {/* Organizer Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 flex items-center p-5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100 shadow-sm"
        >
          <img
            src={userImage || "/placeholder-user.png"}
            alt="Organizer"
            className="w-14 h-14 rounded-full border-2 border-white shadow-md mr-5"
          />
          <div>
            <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
              Organized by
            </span>
            <p className="font-semibold text-gray-800 text-lg mt-2">
              {userName}
            </p>
            <p className="text-sm text-gray-600 mt-1">{userEmail}</p>
          </div>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-gray-50 rounded-2xl shadow-md p-5 border border-gray-200"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
            Description
          </h2>
          <div className="prose prose-base max-w-none">
            <p className="text-gray-700 leading-relaxed">{event.description}</p>
          </div>
        </motion.div>

        {/* Comments Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gray-50 rounded-2xl shadow-lg p-5 mt-2 border border-gray-200"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
            Comments
          </h2>

          {/* Comment Form */}
          {userID && (
            <form onSubmit={handlePostComment} className="mb-6">
              <div className="flex">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write your comment..."
                  className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 placeholder-gray-500 resize-none"
                  rows="1"
                />
                <button
                  type="submit"
                  disabled={!comment.trim()}
                  className="ml-2 px-5 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-300 transition-all"
                >
                  Post
                </button>
              </div>
            </form>
          )}

          {/* Comments List */}
          <div className="space-y-3">
            {comments && comments.length > 0 ? (
              comments.map((comment, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl py-3 px-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center mb-2">
                    <img
                      src={
                        comment.user?.profilePicture || "/placeholder-user.png"
                      }
                      alt="User"
                      className="w-10 h-10 rounded-full mr-3 border border-gray-300"
                    />
                    <div>
                      <p className="font-medium text-gray-900">
                        {comment.user?.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm">{comment.content}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">
                No comments yet. Be the first to comment!
              </p>
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
          className="bg-white shadow-lg rounded-lg p-6"
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
                  Created:{" "}
                  {new Date(event.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
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
              <span className="text-gray-700">
                {event.volunteers?.length || 0} volunteers
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            {/* Share */}
            <motion.button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-md shadow-sm transition"
              whileHover={{ scale: 1.01 }}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                />
              </svg>
              Share
            </motion.button>

            {/* Volunteer / Unvolunteer */}
            <motion.button
              onClick={handleVolunteerToggle}
              disabled={!userID}
              className={`flex items-center justify-center gap-2 font-medium px-4 py-2 rounded-md shadow-sm transition text-white ${isVolunteering
                ? "bg-yellow-600 hover:bg-yellow-700"
                : "bg-indigo-600 hover:bg-indigo-700"
                } ${!userID && "opacity-50 cursor-not-allowed"}`}
              whileHover={{ scale: 1.01 }}
            >
              {isVolunteering ? (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Unvolunteer
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  Volunteer
                </>
              )}
            </motion.button>

            {/* Edit Button (Organizer Only) */}
            {userID === eventOrganizerID && (
              <>
                <motion.button
                  onClick={() => router.push(`/events/edit/${id}`)}
                  className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-md shadow-sm transition"
                  whileHover={{ scale: 1.01 }}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit
                </motion.button>

                <motion.button
                  onClick={handleDelete}
                  className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-md shadow-sm transition"
                  whileHover={{ scale: 1.01 }}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Delete
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
          <div className="flex items-center mb-3">
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
            <p className="text-gray-800 text-lg">{formattedEventDate}</p>
          </div>
        </motion.div>

        {/*AI analysis*/}
        <motion.div
          className="mt-2 px-3 py-5 rounded-lg bg-gradient-to-br from-blue-100 to-purple-50 border border-blue-300 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <div className="flex items-center justify-between mb-3 pr-4">
            <div className="flex items-center">
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

            {event?.eventAnalysis && (
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
            )}
          </div>

          {event?.eventAnalysis ? (
            <div className="relative pl-4 border-l-2 border-purple-200">
              <p className="text-gray-800 text-lg">
                {event.eventAnalysis.reason}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-4">
              <div className="w-10 h-10 border-t-4 border-blue-500 border-solid rounded-full animate-spin mb-3"></div>
              <p className="text-gray-600">Analyzing this request...</p>
            </div>
          )}
        </motion.div>

        {/* Volunteers Section */}
        <motion.div
          className="mt-2 px-3 py-3 rounded-lg bg-gradient-to-br from-green-50 to-teal-50 border border-green-100 shadow-sm"
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

          <div className="relative pl-4">
            {event.volunteers && event.volunteers.length > 0 ? (
              <ul className="list-disc list-inside text-md text-gray-800 pl-1">
                {event.volunteers.map((volunteer, index) => (
                  <li key={index}>{volunteer.name}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic pl-1">
                No volunteers yet. Be the first to volunteer!
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default EventDetailPage
