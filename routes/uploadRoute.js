// import express from "express";
// import multer from "multer";
// import cloudinary from "cloudinary";

// const router = express.Router();

// router.post("/", async (req, res) => {
// 	const buff = Buffer.from(req.body, "base64");
// 	const imgPath = buff.toString("utf-8");

// 	console.log(imgPath);
// 	// try {
// 	// 	let imageRes = await cloudinary.v2.uploader.upload(imgPath, (err, res) => {
// 	// 		console.log(err, res);
// 	// 	});
// 	// 	console.log(imageRes);
// 	res.status(200);
// 	// } catch (err) {
// 	// 	console.log(err);
// 	// 	res.status(500).json({ message: err.message });
// 	// }
// });

// export default router;
