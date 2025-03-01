"use client"
import { AccountCircle, Logout } from "@mui/icons-material"
import { useRouter } from "next/navigation"
import React from "react"

const Profile = () => {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      })

      if (response.ok) {
        router.push("/sign-in")
      } else {
        console.error("Logout failed:", response.statusText)
      }
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const handleProfile = () => {
    router.push("/profile")
  }

  return (
    <div className="flex items-center space-x-8">
      <button
        onClick={handleProfile}
        className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
      >
        <AccountCircle fontSize="medium" />
      </button>
      <button
        onClick={handleLogout}
        className="text-red-500 hover:text-red-700 transition-colors duration-200"
      >
        <Logout fontSize="medium" />
      </button>
    </div>
  )
}

export default Profile
