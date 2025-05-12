"use client"
import { useParams, useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import CheckoutForm from "../../../../components/CheckoutForm"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

const Page = () => {
  const { id } = useParams()
  const router = useRouter()
  const [userID, setUserID] = useState(null)
  const [request, setRequest] = useState({})
  const [requestMakerID, setRequestMakerID] = useState(null)
  const [userName, setUserName] = useState("Anonymous")
  const [userImage, setUserImage] = useState("")
  const [showDonationForm, setShowDonationForm] = useState(false)
  const [donationAmount, setDonationAmount] = useState("")
  const [donationStatus, setDonationStatus] = useState(null)

  // Share functionality
  const handleShare = async (requestId) => {
    try {
      await navigator.share({
        title: request.title,
        text: request.description?.substring(0, 100) + "...",
        url: window.location.href,
      })
    } catch (error) {
      // Fallback to copy link if Web Share API isn't supported
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  const handleDonateClick = () => {
    setShowDonationForm(true)
    // Set default donation amount to either the goal or 100
    setDonationAmount(
      request.donationGoal
        ? Math.min(request.donationGoal, 100).toString()
        : "100"
    )
  }

  const handleDonationSuccess = async (paymentIntent) => {
    setDonationStatus({
      success: true,
      message: "Thank you for your donation!",
    })

    // Refresh the request data to show updated donation amount
    setTimeout(() => {
      setShowDonationForm(false)
      fetchRequestData()
    }, 3000)
  }

  const handleDonationError = (errorMessage) => {
    setDonationStatus({
      success: false,
      message: `Donation failed: ${errorMessage}`,
    })
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

  const fetchRequestData = async () => {
    if (!id) return
    try {
      const response = await fetch(`/api/Requests/${id}`, {
        method: "GET",
      })
      const data = await response.json()

      setRequest(data)
      setRequestMakerID(data.user._id)
    } catch (e) {
      console.error("Error fetching request:", e)
    }
  }

  useEffect(() => {
    fetchRequestData()
  }, [id])

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
      console.error("Error deleting request:", e)
    }
  }

  useEffect(() => {
    if (!requestMakerID) return

    const fetchUserName = async () => {
      try {
        const response = await fetch(`/api/Users/${requestMakerID}`, {
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
  }, [requestMakerID])

  const progressPercentage = request.donationGoal
    ? Math.min(100, (request.donationReceived / request.donationGoal) * 100)
    : 0

  return (
    <div className="grid md:grid-cols-3 gap-4 p-6">
      {/* Left Column - Image and Details */}
      <div className="md:col-span-2">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-4"
        >
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {request.title}
          </h1>
          <div
            className={`inline-block px-2 py-1 rounded-lg text-sm text-white ${request.status === "urgent"
                ? "bg-red-500"
                : request.status === "fulfilled"
                  ? "bg-green-500"
                  : "bg-blue-500"
              }`}
          >
            {request.status?.toUpperCase()}
          </div>
        </motion.div>

        {request.image ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full aspect-video bg-gray-100 rounded-lg overflow-hidden"
          >
            <img
              src={request.image}
              alt={request.title}
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
            {request.description}
          </p>
        </motion.div>
      </div>

      {/* Right Column - Donation Details */}
      <div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-lg rounded-lg p-6 sticky top-4"
        >
          {/* Fundraiser Progress */}
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-xl font-bold text-gray-800">
                ₹{request.donationReceived?.toLocaleString() || "0"}
              </span>
              <span className="text-gray-600">
                raised of ₹{request.donationGoal?.toLocaleString() || "0"} goal
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="bg-green-500 h-2.5 rounded-full"
              ></motion.div>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              {request.donationNumber || 0} donation
              {request.donationNumber !== 1 ? "s" : ""}
            </div>
          </div>

          {/* Donation Form */}
          {showDonationForm ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4"
            >
              <h3 className="text-lg font-semibold mb-3">
                Enter Donation Amount
              </h3>

              <div className="mb-4">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Amount"
                    min="1"
                    step="0.01"
                  />
                </div>
              </div>

              {donationStatus && (
                <div
                  className={`mb-4 p-3 rounded-md ${donationStatus.success
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                    }`}
                >
                  {donationStatus.message}
                </div>
              )}

              <Elements stripe={stripePromise}>
                <CheckoutForm
                  amount={donationAmount}
                  requestId={id}
                  onSuccess={handleDonationSuccess}
                  onError={handleDonationError}
                />
              </Elements>

              <button
                onClick={() => setShowDonationForm(false)}
                className="mt-3 w-full py-2 text-gray-600 hover:text-gray-800 text-sm"
              >
                Cancel
              </button>
            </motion.div>
          ) : (
            /* Action Buttons */
            <motion.div
              className="text-center flex flex-col items-center space-y-2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <motion.button
                onClick={() => handleShare(request._id)}
                className="py-3 w-full bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Share
              </motion.button>

              <motion.button
                onClick={handleDonateClick}
                className="py-3 w-full bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Donate
              </motion.button>

              {userID === requestMakerID && (
                <motion.button
                  onClick={handleDelete}
                  className="py-3 w-full bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Delete Request
                </motion.button>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Replace the existing AI analysis section */}
        <motion.div
          className="mt-3 px-3 py-5 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
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

          {request?.trustAnalysis ? (
            <>
              <div className="flex items-center mb-3">
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
              </div>

              <div className="relative pl-4 border-l-2 border-purple-200">
                <p className="text-gray-800 italic text-[17px]">
                  {request.trustAnalysis.reason}
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

export default Page
