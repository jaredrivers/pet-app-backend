import mongoose from "mongoose";

const petSchema = mongoose.Schema({
	name: { type: String, required: true },
	type: { type: String, required: true },
	adoptionStatus: {
		type: String,
		enum: ["Adopted", "Fostered", "Available"],
		required: true,
	},
	height: { type: Number, required: true },
	weight: { type: Number, required: true },
	color: { type: String, required: true },
	bio: { type: String, required: true },
	hypoallergnic: { type: Boolean, required: true },
	dietary: { type: String },
	breed: { type: String, required: true },
	tags: { type: [String], required: true },
	url: { type: String, default: "" },
});

export default mongoose.model("pets", petSchema);
