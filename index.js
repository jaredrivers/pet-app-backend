import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import app from "./app.js";
import cloudinary from "cloudinary";

const __dirname = path.resolve();

dotenv.config({ path: __dirname + "/.env" });

// cloudinary.config({
// 	cloud_name: process.env.CLOUD_NAME,
// 	api_key: process.env.CLOUDINARY_API_KEY,
// 	api_secret: process.env.CLOUDINARY_API_SECRET,
// });

const PORT = process.env.PORT;

await mongoose
	.connect(process.env.DB_URL)
	.then(() => {
		app.listen(PORT, () => {
			if (process.env.NODE_ENV === "development") {
				console.log(`Server running on http://localhost:${PORT}`);
			}
		});
	})
	.catch((err) => console.log(err.message));
