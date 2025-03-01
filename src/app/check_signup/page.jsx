import { redirect } from "next/navigation"
import { cookies } from "next/headers"

const checkUser = async () => {

    const cookie = (await cookies()).get("auth_token")
    
    const token = cookie?.value
    
    if (token) {
        redirect("/dashboard")
    } else {
        redirect("/sign-up")
    }
}

export default checkUser
