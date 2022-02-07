import User from "../models/userModel.js";

const isAdmin = async (req, id) => {
	const user = await User.findOne({ _id: req.userId });
	if (user.role === "admin") {
		return true;
	} else {
		return false;
	}
};

export default isAdmin;
