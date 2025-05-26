"use client"
import { useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import DashboardRequest from "../../../components/DashboardRequest"
import DashboardEvents from "../../../components/DashboardEvents"
import News from "../../../components/News"

const LoadingSkeleton = ({ className }) => (
  <div
    className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] ${className}`}
  >
    <div className="animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
  </div>
)

const StatCard = ({ title, value, color, isLoading }) => (
  <motion.div
    className={`bg-white rounded-xl shadow-lg p-6 transition-all hover:shadow-xl border-l-4 border-${color}-500 relative overflow-hidden`}
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="relative z-10">
      <p className="text-sm text-gray-500 font-medium uppercase tracking-wide mb-2">
        {title}
      </p>
      {isLoading ? (
        <LoadingSkeleton className="h-8 w-16 rounded" />
      ) : (
        <p className={`text-3xl font-bold text-${color}-600`}>{value}</p>
      )}
    </div>
    <div
      className={`absolute top-0 right-0 w-20 h-20 bg-${color}-100 rounded-full -mr-10 -mt-10 opacity-30`}
    ></div>
  </motion.div>
)

const Home = () => {
  const [user, setUser] = useState(null)
  const [events, setEvents] = useState(null)
  const [requests, setRequests] = useState(null)
  const [userloading, setUserLoading] = useState(true)
  const [eventsLoading, setEventsLoading] = useState(true)
  const [requestsLoading, setRequestsLoading] = useState(true)

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
      } catch (e) {
        console.log(e)
      } finally {
        setUserLoading(false)
      }
    }
    fetchUser()
  }, [])

  useEffect(() => {
    const fetchEvents = async () => {
      setEventsLoading(true)
      try {
        const response = await fetch("/api/Events", {
          method: "GET",
        })

        if (!response.ok) {
          throw new Error("Failed to fetch events")
        }

        const data = await response.json()
        const recentEvents = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
        setEvents(recentEvents)
      } catch (e) {
        console.log(e)
      } finally {
        setEventsLoading(false)
      }
    }
    fetchEvents()
  }, [])

  useEffect(() => {
    const fetchRequests = async () => {
      setRequestsLoading(true)
      try {
        const response = await fetch("/api/Requests", {
          method: "GET",
        })

        if (!response.ok) {
          throw new Error("Failed to fetch requests")
        }

        const data = await response.json()
        const recentRequests = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
        setRequests(recentRequests)
      } catch (e) {
        console.log(e)
      } finally {
        setRequestsLoading(false)
      }
    }
    fetchRequests()
  }, [])

  const name = user?.name

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div className="flex flex-col py-8 px-4 sm:px-6 md:px-8 lg:px-12 max-w-8xl mx-auto">
        <motion.header
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-4">
            <h1 className="text-5xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Welcome,
              </span>
              {userloading ? (
                <LoadingSkeleton className="h-12 w-32 rounded-lg inline-block" />
              ) : (
                <span className="text-gray-800">{name}</span>
              )}
            </h1>
          </div>

          <motion.p
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Your compassion creates ripples of positive change. Here's the
            impact you're making in your community.
          </motion.p>
        </motion.header>

        {/* Main Content Grid */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <div className="lg:col-span-1">
            <DashboardEvents />
          </div>

          <div className="lg:col-span-1">
            <DashboardRequest />
          </div>

          <div className="lg:col-span-1">
            <News />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Home
