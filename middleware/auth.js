import jwt from "jsonwebtoken";

// Auth middleware to confirm that user is user

const auth = async (req, res, next) => {
	try {
		const token = req.headers.authorization.split(" ")[1];
		let decodedData;
		if (token) {
			decodedData = jwt.verify(token, process.env.JWT_TOKEN);
			req.userId = decodedData?.id;
		}
		next();
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: err });
	}
};

export default auth;
