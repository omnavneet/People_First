"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import DashboardRequest from "../../../components/DashboardRequest"
import DashboardEvents from "../../../components/DashboardEvents"
import News from "../../../components/News"

const LoadingSkeleton = ({ className }) => (
  <div
    className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] ${className}`}
  >
    <div className="animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
  </div>
)

const Home = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/Users/current")
        if (!res.ok) throw new Error("Failed to fetch user")
        const data = await res.json()
        setUser(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div className="flex flex-col py-8 px-4 sm:px-6 md:px-8 lg:px-12 max-w-8xl mx-auto">
        <motion.header
          className="text-center mb-5"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Welcome,
            </span>
            {loading ? (
              <LoadingSkeleton className="h-12 w-32 rounded-lg inline-block" />
            ) : (
              <span className="text-gray-800">{user?.name}</span>
            )}
          </h1>
        </motion.header>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <div className="lg:col-span-1 min-h-screen">
            <DashboardEvents />
          </div>
          <div className="lg:col-span-1 min-h-screen">
            <DashboardRequest />
          </div>
          <div className="lg:col-span-1 min-h-screen">
            <News />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Home
