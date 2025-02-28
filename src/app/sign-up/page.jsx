"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

const signUp = () => {
    const [userName, setUserName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [profilePicture, setProfilePicture] = useState("")
    const [error, setError] = useState("")
    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault()

        const formData = new FormData()

        formData.append("userName", userName)
        formData.append("email", email)
        formData.append("password", password)
        if (profilePicture) {
            formData.append("profilePicture", profilePicture)
        }

        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                body: formData,
            })

            if (!res.ok) {
                const errorMessage = await res.text()
                throw new Error(errorMessage || "Something went wrong!")
            }

            const data = await res.json()
            console.log(data)

            if (data.error) {
                setError(data.error)
                return
            }

            localStorage.setItem("token", data.token)
            console.log("User created successfully")
            router.push("/dashboard")
        } catch (error) {
            console.error(error)
        }
    }

    const goToSignIn = () => {
        router.push("/sign-in");
    }


    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="w-full max-w-md p-8 bg-gray-100 rounded-md shadow-lg">
                <h1 className="text-4xl font-bold">Create Account,</h1>
                <h1 className="text-2xl font-semibold text-gray-700 mt-1">
                    Sign up to get started!
                </h1>

                <form
                    className="mt-12 space-y-4"
                    onSubmit={handleSubmit}
                >
                    <div>
                        <label className="block text-sm font-medium text-gray-700">User Name</label>
                        <input
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        ></input>
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">Email ID</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        ></input>
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        ></input>
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Profile Picture (optional)
                        </label>
                        <input
                            type="file"
                            value={profilePicture}
                            onChange={(e) => setProfilePicture(e.target.files[0])}
                            className="rounded-md w-full mt-1 focus:outline-none text-sm"
                        ></input>
                    </div>

                    <button
                        type="submit"
                        className="w-full mt-6 bg-black text-white py-3 rounded-md hover:bg-gray-800 transition duration-200"
                    >
                        Sign Up
                    </button>
                </form>

                {error && <p className="text-red-500 mt-4 flex items-center justify-center font-semibold">{error}</p>}

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{" "}
                        <button
                            onClick={goToSignIn}
                            className="font-medium text-blue-600 hover:text-blue-800 transition duration-200 w-full"
                        >
                            Sign In
                        </button>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default signUp
