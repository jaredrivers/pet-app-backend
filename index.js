import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import app from "./app.js";

const __dirname = path.resolve();

dotenv.config({ path: __dirname + "/.env" });

const PORT = process.env.PORT;

const startServer = async () => {
	await mongoose
		.connect(process.env.DB_URL)
		.then(() => {
			app.listen(PORT, () => {
				if (process.env.NODE_ENV == "development") {
					console.log(`Server running on http://localhost:${PORT}`);
				}
			});
		})
		.catch((err) => console.log(err.message));
};

startServer();
