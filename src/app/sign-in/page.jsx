"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"

const signIn = () => {
  const [userName, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const signInSchema = z.object({
    userName: z.string().min(3, "User Name must be at least 5 characters long"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  })

  const handleSubmit = async (e) => {
    e.preventDefault()

    const result = signInSchema.safeParse({
      userName,
      password,
    })

    if (!result.success) {
      const firstError = result.error.issues[0].message
      setError(firstError)
      return
    }

    const formData = new FormData()

    formData.append("userName", userName)
    formData.append("password", password)

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        const errorMessage = await res.text()
        throw new Error(errorMessage || "Something went wrong!")
      }

      const data = await res.json()

      if (data.error) {
        setError(data.error)
        return
      }

      router.push("/dashboard")
      console.log(data)
    } catch (error) {
      console.error(error)
    }
  }

  const goToSignUp = () => {
    router.push("/sign-up")
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-md px-8 py-10 bg-white rounded-xl shadow-md transform transition duration-500 hover:shadow-lg">
        <div className="border-l-4 border-green-500 pl-4 mb-6">
          <h1 className="text-4xl font-bold text-gray-800">Welcome,</h1>
          <h1 className="text-2xl font-semibold text-gray-600 mt-1">
            Sign in to continue!
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
              required
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
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-green-600 text-white font-medium rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transform transition-all duration-200 hover:-translate-y-0.5"
          >
            Sign In
          </button>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <button
              onClick={goToSignUp}
              className="font-medium text-green-600 hover:text-green-800 underline transition duration-200"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default signIn
