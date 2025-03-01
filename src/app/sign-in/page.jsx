"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

const signIn = () => {

    const [userName, setUserName] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault()

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
        router.push("/sign-up");
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="w-full max-w-md px-8 py-10 bg-gray-100 rounded-md shadow-lg">
                <h1 className="text-4xl font-bold">Welcome,</h1>
                <h1 className="text-2xl font-semibold text-gray-700 mt-1">
                    Sign in to continue!
                </h1>

                <form
                    className="mt-12 space-y-6"
                    onSubmit={handleSubmit}
                >
                    <div>
                        <label className="block text-sm font-medium text-gray-700">User Name</label>
                        <input
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            required
                        />
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full mt-6 bg-black text-white py-3 rounded-md hover:bg-gray-800 transition duration-200"
                    >
                        Sign In
                    </button>

                    {error && <p className="text-red-500 text-sm mt-2 font-semibold self-center">{error}</p>}
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{" "}
                        <button
                            onClick={goToSignUp}
                            className="font-medium text-blue-600 hover:text-blue-800 transition duration-200 w-full"
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
