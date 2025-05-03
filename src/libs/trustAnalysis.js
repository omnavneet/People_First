import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { PromptTemplate } from "@langchain/core/prompts"
import { RunnableSequence } from "@langchain/core/runnables"
import z from "zod"
import { StructuredOutputParser } from "@langchain/core/output_parsers"

// Define the output schema using Zod
const trustAnalysisParser = StructuredOutputParser.fromZodSchema(
  z.object({
    summary: z.string().describe("A short summary of the analysis"),
    judgment: z
      .enum(["Trustworthy", "Needs Review", "Suspicious"])
      .describe("Final judgment on the request"),
    reason: z.string().describe("Brief explanation for the judgment"),
  })
)

// Template to evaluate trust with proper format instructions
const templateString = `You are an assistant that evaluates trustworthiness of fundraising requests.
Given the following information:
Title: {title}
Description: {description}
Donation Goal: ₹{donationGoal}

1. Analyze if the request seems genuine or suspicious.
2. Briefly explain your reasoning.
3. Give a final judgment: "Trustworthy", "Needs Review", or "Suspicious".

{format_instructions}
`

// Set up Google GenAI LLM with the proper imports
export async function analyzeRequestTrust(data) {
  try {
    const model = new ChatGoogleGenerativeAI({
      apiKey: process.env.NEXT_GOOGLE_GEMINI_API_KEY,
      temperature: 0,
      model: "gemini-1.5-flash",
    })

    const formatInstructions = trustAnalysisParser.getFormatInstructions()

    const prompt = PromptTemplate.fromTemplate(templateString)

    const chain = RunnableSequence.from([
      {
        title: (input) => input.title,
        description: (input) => input.description,
        donationGoal: (input) => input.donationGoal,
        format_instructions: () => formatInstructions,
      },
      prompt,
      model,
      async (response) => {
        try {
          return await trustAnalysisParser.parse(response.content)
        } catch (error) {
          console.error("Error parsing output:", error)
          return {
            summary: "Error analyzing request",
            judgment: "Needs Review",
            reason: "Could not parse analysis results.",
          }
        }
      },
    ])

    const result = await chain.invoke(data)
    return result
  } catch (error) {
    console.error("Trust analysis error:", error)
    return {
      summary: "Error analyzing request",
      judgment: "Needs Review",
      reason: "An error occurred during analysis.",
    }
  }
}
