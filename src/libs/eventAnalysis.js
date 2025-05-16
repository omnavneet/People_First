import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { PromptTemplate } from "@langchain/core/prompts"
import { RunnableSequence } from "@langchain/core/runnables"
import z from "zod"
import { StructuredOutputParser } from "@langchain/core/output_parsers"

const trustAnalysisParser = StructuredOutputParser.fromZodSchema(
  z.object({
    judgment: z
      .enum(["Trustworthy", "Needs Review", "Suspicious"])
      .describe("Final judgment on the request"),
    reason: z.string().describe("Brief explanation for the judgment"),
  })
)

const templateString = `You are an assistant that evaluates trustworthiness of fundraising events.
Given the following information:
Title: {title}
Description: {description}

1. Analyze if the event seems genuine or suspicious.
2. Briefly explain your reasoning.
3. Give a final judgment: "Trustworthy", "Needs Review", or "Suspicious".

{format_instructions}
`

export async function analyzeEventTrust(data) {
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
      judgment: "Needs Review",
      reason: "An error occurred during analysis.",
    }
  }
}
