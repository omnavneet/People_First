"use client"
import { useParams, useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import CheckoutForm from "../../../../components/CheckoutForm"


const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

const LoadingSkeleton = ({ className }) => (
  <div
    className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] ${className}`}
  >
    <div className="animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
  </div>
)

// Status component
const Status = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case "fulfilled":
        return {
          color: "bg-gradient-to-r from-green-500 to-emerald-600",
          text: "FULFILLED",
        }
      case "urgent":
        return {
          color: "bg-gradient-to-r from-red-500 to-rose-600",
          text: "URGENT",
        }
      default:
        return {
          color: "bg-gradient-to-r from-blue-500 to-indigo-600",
          text: "ACTIVE",
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

const Page = () => {
  const { id } = useParams()
  const router = useRouter()
  const [userID, setUserID] = useState(null)
  const [request, setRequest] = useState({})
  const [requestMakerID, setRequestMakerID] = useState(null)
  const [userName, setUserName] = useState("Anonymous")
  const [userEmail, setUserEmail] = useState("")
  const [userImage, setUserImage] = useState("")
  const [showDonationForm, setShowDonationForm] = useState(false)
  const [donationAmount, setDonationAmount] = useState("")
  const [donationStatus, setDonationStatus] = useState(null)
  const [loading, setLoading] = useState(true)

  // Share functionality
  const handleShare = async (requestId) => {
    try {
      await navigator.share({
        title: request.title,
        text: request.description?.substring(0, 100) + "...",
        url: window.location.href,
      })
    } catch (error) {
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  // Handle donation button click
  const handleDonateClick = () => {
    setShowDonationForm(true)
    setDonationAmount(
      request.donationGoal
        ? Math.min(request.donationGoal, 100).toString()
        : "100"
    )
  }

  // Handle donation success and error
  const handleDonationSuccess = async (paymentIntent) => {
    setDonationStatus({
      success: true,
      message: "Thank you for your donation!",
    })

    setTimeout(() => {
      setShowDonationForm(false)
      fetchRequestData()
    }, 3000)
  }


  // Handle donation error
  const handleDonationError = (errorMessage) => {
    setDonationStatus({
      success: false,
      message: `Donation failed: ${errorMessage}`,
    })
  }

  // Fetch current user ID
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/Users/current`)
        const data = await response.json()
        setUserID(data._id)
      } catch (e) {
        console.log("Error fetching user:", e)
      }
    }
    fetchUser()
  }, [])


  // Fetch request data
  const fetchRequestData = async () => {
    if (!id) return

    setLoading(true)
    try {
      const response = await fetch(`/api/Requests/${id}`, {
        method: "GET",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      setRequest(data)
      setRequestMakerID(data.user?._id)

      // Set user information -->> if available
      if (data.user) {
        setUserName(data.user.name || "Anonymous")
        setUserEmail(data.user.email || "")
        setUserImage(data.user.profilePicture || "")
      }
    } catch (e) {
      console.log("Error fetching request:", e)
    } finally {
      setLoading(false)
    }
  }

  // Fetch request data on component mount and when ID changes
  useEffect(() => {
    fetchRequestData()
  }, [id])

  // Handle delete request
  const handleDelete = async () => {
    if (requestMakerID !== userID) {
      return
    }

    try {
      await fetch(`/api/Requests/${id}`, {
        method: "DELETE",
      })
      router.push("/requests")
    } catch (e) {
      console.log("Error deleting request:", e)
    }
  }

  // Fetch user name and email based on request maker ID
  useEffect(() => {
    if (!requestMakerID) return

    const fetchUserName = async () => {
      try {
        const response = await fetch(`/api/Users/${requestMakerID}`, {
          method: "GET",
        })
        const data = await response.json()
        setUserName(data.name)
        setUserEmail(data.email)
        setUserImage(data.profilePicture)
      } catch (e) {
        console.log("Error fetching user name:", e)
      }
    }

    fetchUserName()
  }, [requestMakerID])

  // Calculate progress percentage
  const progressPercentage = request.donationGoal
    ? Math.min(100, (request.donationReceived / request.donationGoal) * 100)
    : 0

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
            {request.title}
          </h1>
          <Status status={request.status} />
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
              src={request.image}
              alt={request.title}
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
            alt="Request Maker"
            className="w-14 h-14 rounded-full border-2 border-white shadow-md mr-5"
          />
          <div>
            <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
              Requested by
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
          className="mt-6 bg-gray-50 rounded-2xl shadow-md p-5 border border-gray-200"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
            Description
          </h2>
          <div className="prose prose-base max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {request.description}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right Column - Donation Details */}
      <div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-lg rounded-lg p-6"
        >
          {/* Fundraiser Progress */}
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-green-500 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
              <h2 className="text-lg font-semibold text-gray-800">
                Fundraising Progress
              </h2>
            </div>

            <div className="flex justify-between mb-2">
              <span className="text-2xl font-bold text-gray-800">
                ₹{request.donationReceived?.toLocaleString() || "0"}
              </span>
              <span className="text-gray-600 text-sm">
                of ₹{request.donationGoal?.toLocaleString() || "0"} goal
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full shadow-sm"
              ></motion.div>
            </div>

            <div className="flex justify-between text-sm text-gray-600">
              <span>{Math.round(progressPercentage)}% funded</span>
              <span>
                {request.donationNumber || 0} donation
                {request.donationNumber !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* Donation Form */}
          {showDonationForm ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4"
            >
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Enter Donation Amount
              </h3>

              <div className="mb-4">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-800"
                    placeholder="Enter amount"
                    min="1"
                    step="0.01"
                  />
                </div>
              </div>

              {donationStatus && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`mb-4 p-3 rounded-lg ${donationStatus.success
                      ? "bg-green-100 text-green-800 border border-green-200"
                      : "bg-red-100 text-red-800 border border-red-200"
                    }`}
                >
                  {donationStatus.message}
                </motion.div>
              )}

              <Elements stripe={stripePromise}>
                <CheckoutForm
                  amount={donationAmount}
                  requestId={id}
                  userId={userID}
                  onSuccess={handleDonationSuccess}
                  onError={handleDonationError}
                />
              </Elements>

              <button
                onClick={() => setShowDonationForm(false)}
                className="mt-3 w-full py-2 text-gray-600 hover:text-gray-800 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          ) : (
            /* Action Buttons */
            <motion.div
              className="grid grid-cols-2 gap-3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <motion.button
                onClick={() => handleShare(request._id)}
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

              <motion.button
                onClick={handleDonateClick}
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
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                Donate
              </motion.button>

              {userID === requestMakerID && (
                <>
                  <motion.button
                    onClick={() => router.push(`/requests/edit/${id}`)}
                    className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-md shadow-sm transition"
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
          )}

          {/* Request Meta Info */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center text-sm text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-400 mr-2"
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
              Created:{" "}
              {new Date(request.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </div>
          </div>
        </motion.div>

        {/* AI Analysis */}
        <motion.div
          className="mt-3 px-3 py-5 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
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

            {request?.trustAnalysis && (
              <div
                className={`px-3 py-1 rounded-full text-white text-sm font-medium ${request.trustAnalysis.judgment === "Trustworthy"
                    ? "bg-green-500"
                    : request.trustAnalysis.judgment === "Needs Review"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
              >
                {request.trustAnalysis.judgment}
              </div>
            )}
          </div>

          {request?.trustAnalysis ? (
            <div className="relative pl-4 border-l-2 border-purple-200">
              <p className="text-gray-800 text-lg">
                {request.trustAnalysis.reason}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-4">
              <div className="w-10 h-10 border-t-4 border-blue-500 border-solid rounded-full animate-spin mb-3"></div>
              <p className="text-gray-600">Analyzing this request...</p>
            </div>
          )}
        </motion.div>

        {/* Donors Section */}
        <motion.div
          className="mt-2 px-3 py-3 rounded-lg bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center mr-3">
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
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              Donors
            </h2>
          </div>

          <div className="relative pl-4">
            {request.donations && request.donations.length > 0 ? (
              <div className="space-y-3">
                {request.donations.map((donation, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-white p-3 rounded-lg border border-emerald-100 shadow-sm"
                  >
                    <div className="flex items-center">
                      <img
                        src={
                          donation.donor?.profilePicture ||
                          "/placeholder-user.png"
                        }
                        alt="Donor"
                        className="w-8 h-8 rounded-full border border-emerald-200 mr-3"
                      />
                      <span className="text-gray-800 font-medium">
                        {donation.donor?.name || "Anonymous"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-emerald-600 font-semibold">
                        ₹{donation.amount?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic pl-1">
                No donors yet. Be the first to donate!
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Page
