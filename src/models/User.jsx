import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: Number, required: true },
  profilePicture: { type: String, required: false },
})

return mongoose.models.User || mongoose.model("User", UserSchema)
