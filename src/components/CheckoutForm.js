"use client"
import React, { useState } from "react"
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js"

const CheckoutForm = ({ amount, userId, requestId, onSuccess, onError }) => {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    setIsLoading(true)
    setErrorMessage("")

    try {
      // Payment intent on server
      const response = await fetch(`/api/make_payment`, {
        method: "POST",
        body: JSON.stringify({
          amount: amount,
          donorId: userId,
          currency: "inr",
        }),
      })

      const { clientSecret, error: serverError } = await response.json()

      if (serverError) {
        setErrorMessage(serverError)
        setIsLoading(false)
        onError(serverError)
        return
      }

      // Confirm card payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        }
      )

      if (error) {
        setErrorMessage(error.message)
        onError(error.message)
      } else if (paymentIntent.status === "succeeded") {
        try {
          const updateResponse = await fetch(
            `/api/Requests/${requestId}/donate`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                amount: parseFloat(amount),
                donorId: userId,
              }),
            }
          )

          if (!updateResponse.ok) {
            const errorData = await updateResponse.json()
            console.error("Failed to update donation record:", errorData)
          }

          onSuccess(paymentIntent)
        } catch (updateError) {
          console.error("Error updating donation:", updateError)
          // Still consider the payment successful even if the update fails
          onSuccess(paymentIntent)
        }
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred.")
      onError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Card Details
        </label>
        <div className="p-3 border border-gray-300 rounded-md">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
                invalid: {
                  color: "#9e2146",
                },
              },
            }}
          />
        </div>
      </div>

      {errorMessage && (
        <div className="text-red-500 text-sm">{errorMessage}</div>
      )}

      <button
        type="submit"
        disabled={!stripe || isLoading}
        className={`w-full py-3 text-white rounded-lg transition-all ${isLoading ? "bg-green-600" : "bg-green-700 hover:bg-green-800"
          }`}
      >
        {isLoading ? "Processing..." : `Donate ₹${amount}`}
      </button>
    </form>
  )
}

export default CheckoutForm
