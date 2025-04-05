"use client"
import { useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import DashboardRequest from "@/components/DashboardRequest"
import DashboardEvents from "@/components/DashboardEvents"

const Home = () => {
  const [user, setUser] = useState(null)
  const [events, setEvents] = useState(null)
  const [requests, setRequests] = useState(null)
  const [userloading, setUserLoading] = useState(true)

  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      setUserLoading(true)
      try {
        const response = await fetch("/api/Users/current", {
          method: "GET",
        })

        if (!response.ok) {
          throw new Error("Failed to fetch user")
        }
        const data = await response.json()
        setUser(data)
        setUserLoading(false)
      } catch (e) {
        console.log(e)
        setUserLoading(false)
      }
    }
    fetchUser()
  }, [])

  useEffect(() => {
    const fetchEvents = async () => {
     
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
        setEvents(recentEvents)
      } catch (e) {
        console.log(e)
       
      }
    }
    fetchEvents()
  }, [])

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch("/api/Requests", {
          method: "GET",
        })

        if (!response.ok) {
          throw new Error("Failed to fetch requests")
        }

        const data = await response.json()
        const recentRequests = data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        setRequests(recentRequests)
      } catch (e) {
        console.log(e)
      }
    }
    fetchRequests()
  }, [])

  const name = user?.name
  const TotalDonationReceived = requests?.reduce(
    (total, request) => total + (request.donationReceived || 0),
    0
  )
  

  return (
    <div className="flex flex-col py-4 px-2 sm:px-6 md:px-4 lg:px-8 bg-green-50 min-h-screen">
      <motion.header
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-3 flex items-center justify-center">
          Welcome,
          {userloading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin">
                {" "}
              </div>
            </div>
          ) : (
            ` ${name}`
          )}
        </h1>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Your compassion creates ripples of positive change. Here's the impact
          you're making in your community.
        </p>
      </motion.header>

      {/* Stats Row */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, staggerChildren: 0.1 }}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-md p-6 flex items-center transition-all hover:shadow-lg border-l-4 border-green-500"
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <div>
            <p className="text-sm text-gray-500 font-medium">
              Total Funds Raised
            </p>
            <p className="text-3xl font-bold text-gray-800">
              ₹{TotalDonationReceived?.toLocaleString() || "0"}
            </p>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-2xl shadow-md p-6 flex items-center transition-all hover:shadow-lg border-l-4 border-blue-500"
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <div>
            <p className="text-sm text-gray-500 font-medium">
              Support Requests
            </p>
            <p className="text-3xl font-bold text-gray-800">
              {requests?.length || "0"}
            </p>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-2xl shadow-md p-6 flex items-center transition-all hover:shadow-lg border-l-4 border-purple-500"
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <div>
            <p className="text-sm text-gray-500 font-medium">
              Number of Events
            </p>
            <p className="text-3xl font-bold text-gray-800">
              {events?.length || "0"}
            </p>
          </div>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">

        {/* Events Section */}
       <DashboardEvents />

        {/* Requests Section */}
        <DashboardRequest />


        <div className="space-y-6">
          {/* Quick Actions */}
          <motion.div
            className="bg-white rounded-2xl shadow-md p-6 border border-gray-100"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Quick Actions
            </h2>
            <div className="grid grid-2 gap-3">
              <motion.button
                onClick={() => router.push("/requests/new")}
                className="p-3 bg-blue-50 rounded-xl text-blue-700 text-sm font-medium hover:bg-blue-100 transition-colors"
                whileHover={{ scale: 1.05, backgroundColor: "#dbeafe" }}
                whileTap={{ scale: 0.98 }}
              >
                Create a Request
              </motion.button>
              <motion.button
                onClick={() => router.push("/events/new")}
                className="p-3 bg-green-50 rounded-xl text-green-700 text-sm font-medium hover:bg-green-100 transition-colors"
                whileHover={{ scale: 1.05, backgroundColor: "#dcfce7" }}
                whileTap={{ scale: 0.98 }}
              >
                Create an Event
              </motion.button>
              <motion.button
                onClick={() => router.push("/share")}
                className="p-3 bg-purple-50 rounded-xl text-purple-700 text-sm font-medium hover:bg-purple-100 transition-colors"
                whileHover={{ scale: 1.05, backgroundColor: "#f3e8ff" }}
                whileTap={{ scale: 0.98 }}
              >
                Share Impact
              </motion.button>
              <motion.button
                onClick={() => router.push("/contact")}
                className="p-3 bg-pink-50 rounded-xl text-pink-700 text-sm font-medium hover:bg-pink-100 transition-colors"
                whileHover={{ scale: 1.05, backgroundColor: "#fce7f3" }}
                whileTap={{ scale: 0.98 }}
              >
                Contact Us
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Home
