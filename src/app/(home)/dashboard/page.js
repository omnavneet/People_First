"use client"
import React, { useEffect, useState } from "react"

const home = () => {
  const [user, setUser] = useState(null)

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

  const id = user?._id
  const name = user?.name
  console.log(user)

  return (
    <div className="flex flex-col justify-center p-5">
      <h1>Welcome to the dashboard : {name}</h1>
      <p>Here you can see all your requests and events</p>
      <p>Your user id is: {id}</p>
    </div>
  )
}

export default home
