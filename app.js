import petRoutes from "./routes/pet.js";
import userRoutes from "./routes/users.js";
import signupRoute from "./routes/signupRoute.js";
// import uploadRoute from "./routes/uploadRoute.js";
import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	);
	next();
});

app.use("/user", userRoutes);
app.use("/signup", signupRoute);
app.use("/pet", petRoutes);

// app.use("/uploadphoto", uploadRoute);

export default app;
