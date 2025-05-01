import Stripe from "stripe"
import { NextResponse } from "next/server"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(req) {
  try {
    const { amount, currency = "usd" } = await req.json()
  
    const amountInCents = Math.round(parseFloat(amount) * 100)

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: currency,
      payment_method_types: ["card"],
    })

    return NextResponse.json(
      { clientSecret: paymentIntent.client_secret }, 
      { status: 200 }
    )
  } catch (error) {
    console.error("Payment error:", error)
    return NextResponse.json(
      { error: error.message }, 
      { status: 500 }
    )
  }
}