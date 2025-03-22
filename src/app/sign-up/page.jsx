"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"

const signUp = () => {
  const [userName, setUserName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [profilePicture, setProfilePicture] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const signUpSchema = z.object({
    userName: z.string().min(3, "User Name must be at least 3 characters"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    profilePicture: z.instanceof(File).optional(),
  })

  const handleSubmit = async (e) => {
    e.preventDefault()

    const result = signUpSchema.safeParse({
      userName,
      email,
      password,
      profilePicture,
    })

    if (!result.success) {
      const firstError = result.error.issues[0].message
      setError(firstError)
      return
    }

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

      console.log("User created successfully")
      router.push("/dashboard")
    } catch (error) {
      console.error(error)
    }
  }

  const goToSignIn = () => {
    router.push("/sign-in")
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-md px-8 py-10 bg-white rounded-xl shadow-md transform transition duration-500 hover:shadow-lg">
        <div className="border-l-4 border-green-500 pl-4 mb-6">
          <h1 className="text-4xl font-bold text-gray-800">Create Account,</h1>
          <h1 className="text-2xl font-semibold text-gray-600 mt-1">
            Sign up to get started!
          </h1>
        </div>

        <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              User Name
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Email ID
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Profile Picture (optional)
            </label>
            <input
              type="file"
              onChange={(e) => setProfilePicture(e.target.files[0])}
              className="w-full mt-1 p-2 text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-green-600 text-white font-medium rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transform transition-all duration-200 hover:-translate-y-0.5"
          >
            Sign Up
          </button>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <button
              onClick={goToSignIn}
              className="font-medium text-green-600 hover:text-green-800 underline transition duration-200"
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
