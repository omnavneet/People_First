import { createNewUser } from "@/libs/handlers/user.js"

export async function POST(req) {
  return await createNewUser(req)
}
