"use client"
import { useParams, useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { set } from "mongoose"

const Page = () => {
  const { id } = useParams()
  const router = useRouter()
  const [userID, setUserID] = useState(null)
  const [request, setRequest] = useState({})
  const [requestMakerID, setRequestMakerID] = useState(null)
  const [userName, setUserName] = useState("Anonymous")
  const [userImage, setUserImage] = useState("")

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
    if (!id) return
    const fetchRequests = async () => {
      try {
        const response = await fetch(`/api/Requests/${id}`, {
          method: "GET",
        })
        const data = await response.json()
        console.log(data)
        setRequest(data)
        setRequestMakerID(data.user)
      } catch (e) {
        console.error("Error fetching request:", e)
      }
    }
    fetchRequests()
  }, [id])

  const handleDelete = async () => {
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

  // Calculate donation progress percentage
  const progressPercentage = request.donationGoal
    ? Math.min(100, (request.donationReceived / request.donationGoal) * 100)
    : 0

  return (
    <div className="grid md:grid-cols-3 gap-6 p-6">
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
            className={`inline-block px-2 py-1 rounded-lg text-sm text-white ${
              request.status === "urgent"
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
          <motion.img
            src={request.image}
            alt={request.title || "Request Image"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full h-80 object-cover rounded-lg"
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full h-80 flex items-center justify-center text-gray-400 bg-gray-100 rounded-lg"
          >
            No Image Available
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
            src={userImage || null}
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

          {/* Action Buttons */}
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
              onClick={() => handleDonate(request._id)}
              className="py-3 w-full bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Donate
            </motion.button>
          </motion.div>

          {/* Status Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-6"
          >
            <div
              className={`p-3 rounded-lg ${
                request.status === "urgent"
                  ? "bg-red-100 text-red-800"
                  : request.status === "fulfilled"
                  ? "bg-green-100 text-green-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {request.status === "urgent"
                ? "This request is marked as urgent and needs immediate attention."
                : request.status === "fulfilled"
                ? "This request has been fulfilled. Thank you for your support!"
                : "This request is active and seeking donations."}
            </div>
          </motion.div>

          {/* Created Date */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mt-6 text-center text-gray-600 text-sm"
          >
            Created{" "}
            {request.createdAt
              ? new Date(request.createdAt).toLocaleDateString()
              : "recently"}
          </motion.div>
        </motion.div>
        {/* Admin Action Buttons */}
        {userID === requestMakerID && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 flex space-x-4"
          >
            <motion.button
              onClick={handleDelete}
              className="py-3 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors max-3/4 mx-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Delete Request
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Page
