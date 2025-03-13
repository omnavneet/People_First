"use client"
import React, { useState, useEffect } from "react"

const Page = () => {
    const [requests, setRequests] = useState([])
    const [newRequest, setNewRequest] = useState({
        title: "",
        description: "",
        donationGoal: 1000,
    })
    const [userId, setUserId] = useState(null)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch("/api/Users/current", {
                    method: "GET",
                    credentials: "include",
                })
                const data = await response.json()
                if (data._id) {
                    setUserId(data._id)
                } else {
                    console.error("User not found or not authenticated")
                }
            } catch (error) {
                console.error("Error fetching user:", error)
            }
        }

        fetchUser()
    }, [])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setNewRequest((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleNewRequest = async () => {
        if (!userId) {
            console.error("User ID is not available")
            return
        }

        try {
            const response = await fetch("/api/Requests", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...newRequest,
                    user: userId,
                }),
            })

            if (!response.ok) {
                console.error("Error creating request:", response.statusText)
                return
            }

            const data = await response.json()
            setRequests([data, ...requests])
            setNewRequest({
                title: "",
                description: "",
                donationGoal: 1000,
            })
        } catch (error) {
            console.error("Error creating request:", error)
        }
    }

    return (
        <div className="p-8 md:px-32">
            <div className="w-full max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-xl shadow-2xl border border-gray-100">
                <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">
                    Create New Request
                </h2>
                <div className="space-y-8">
                    {/* Title */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-3">
                            Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={newRequest.title}
                            onChange={handleInputChange}
                            className="w-full p-3.5 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400"
                            placeholder="Enter a title"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-3">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={newRequest.description}
                            onChange={handleInputChange}
                            rows="6"
                            className="w-full p-3.5 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400"
                            placeholder="Describe your request"
                        />
                    </div>

                    {/* Donation Goal */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-3">
                            Donation Goal
                        </label>
                        <input
                            type="number"
                            name="donationGoal"
                            value={newRequest.donationGoal}
                            onChange={handleInputChange}
                            className="w-full p-3.5 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400"
                            placeholder="Enter donation goal"
                        />
                    </div>

                    {/* Image URL (Optional) */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-3">
                            Image URL (Optional)
                        </label>
                        <input
                            type="text"
                            name="image"
                            value={newRequest.image}
                            onChange={handleInputChange}
                            className="w-full p-3.5 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400"
                            placeholder="Paste an image URL"
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-3">
                            Status
                        </label>
                        <select
                            name="status"
                            value={newRequest.status}
                            onChange={handleInputChange}
                            className="w-full p-3.5 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
                        >
                            <option value="open">Open</option>
                            <option value="closed">Closed</option>
                        </select>
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleNewRequest}
                        className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl text-lg font-semibold transform"
                    >
                        Create Request
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Page
