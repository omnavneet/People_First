"use client"
import React, { useEffect, useState } from "react"

const home = () => {
  const [user, setUser] = useState(null)
  const [events, setEvents] = useState(null)
  const [requests, setRequests] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch("/api/Users/current", {
        method: "GET",
      })
      const data = await response.json()
      setUser(data)
    }
    fetchUser()
  }, [])

  useEffect(() => {
    const fetchEvents = async () => {
      const response = await fetch("/api/Events", {
        method: "GET",
      })
      const data = await response.json()
      const recentEvents = data
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)

      setEvents(recentEvents)
    }
    fetchEvents()
  }, [])

  useEffect(() => {
    const fetchRequests = async () => {
      const response = await fetch("/api/Requests", {
        method: "GET",
      })
      const data = await response.json()
      const recentRequests = data
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)

      setRequests(recentRequests)
    }
    fetchRequests()
  }, [])

  const id = user?._id
  const name = user?.name


  return (
    <div className="flex flex-col justify-center py-5 px-32">
      <h1 className="text-4xl font-semibold">Hello {name}!</h1>
      <div className="flex space-x-5 mt-5">
        
        <div className="bg-white rounded-lg shadow-lg p-5 mt-5 w-1/5"> 
          <h2 className="text-2xl font-semibold">Recent Events</h2>
          <ul>
            {events?.map((event) => (
              <li key={event._id} className="my-2">
                <h3 className="text-lg font-semibold">{event.title}</h3>
                <p>{event.description}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-5 mt-5 w-1/5">
          <h2 className="text-2xl font-semibold">Recent Requests</h2>
          <ul>
            {requests?.map((request) => (
              <li key={request._id} className="my-2">
                <h3 className="text-lg font-semibold">{request.title}</h3>
                <p>{request.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default home
