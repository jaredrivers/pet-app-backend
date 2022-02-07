import mongoose from "mongoose";

const userSchema = mongoose.Schema({
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	phoneNumber: { type: String, required: true },
	role: { type: String, default: "user" },
	pets: { type: [String] },
	favorites: { type: [String] },
	fostering: { type: [String] },
	url: { type: String },
	bio: { type: String },
});

export default mongoose.model("users", userSchema);
