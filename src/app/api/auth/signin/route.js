import { signin } from "@/libs/handlers/user.js"

export async function POST(req) {
  return await signin(req)
}
