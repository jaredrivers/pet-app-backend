import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import isAdmin from "../functions/isAdmin.js";

export const signUp = async (req, res) => {
	const { email, password, confirmPassword, firstName, lastName, phoneNumber } =
		req.body;
	try {
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ message: "User already exists." });
		}
		if (password != confirmPassword) {
			return res.status(400).json({ message: "Passwords do not match." });
		}
		const hashedPassword = await bcrypt.hash(password, 10);

		const user = await User.create({
			email,
			password: hashedPassword,
			firstName,
			lastName,
			phoneNumber,
			role: "",
			pets: [],
			bio: "",
			favorites: [],
			fostering: [],
			url: "",
		});
		const token = jwt.sign(
			{ email: user.email, id: user._id },
			process.env.JWT_TOKEN,
			{
				expiresIn: "1h",
			}
		);
		res.status(200).json({
			user: { email, firstName, lastName, id: user._id, role: user.role },
			token,
		});
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const signIn = async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(404).json({ message: "User does not exist." });
		}
		const isPasswordCorrect = await bcrypt.compare(password, user.password);

		if (!isPasswordCorrect) {
			return res.status(400).json({ message: "Invalid credentials." });
		}

		const token = jwt.sign(
			{ email: user.email, id: user._id, role: user.role },
			process.env.JWT_TOKEN
		);

		res.status(200).json({
			user: {
				id: user._id,
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
				role: user.role,
			},
			token,
		});
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const updateUser = async (req, res) => {
	const id = req.userId;

	let updateBody = req.body;
	let updates = {};

	async function update({
		email,
		firstName,
		lastName,
		phoneNumber,
		password,
		confirmPassword,
	}) {
		if (email) {
			updates.email = email;
		}
		if (firstName) {
			updates.firstName = firstName;
		}
		if (lastName) {
			updates.lastName = lastName;
		}
		if (phoneNumber) {
			updates.phoneNumber = phoneNumber;
		}
		if (password) {
			if (password != confirmPassword) {
				return res.status(400).json({ message: "Passwords do not match." });
			} else {
				const hashedPassword = await bcrypt.hash(password, 10);
				updates.password = hashedPassword;
			}
		}

		return await User.findByIdAndUpdate(
			{ _id: id },
			{
				$set: updates,
			},
			{
				new: true,
			}
		);
	}

	try {
		let user = await update(updateBody);

		const token = jwt.sign(
			{ email: user.email, id: user._id },
			process.env.JWT_TOKEN,
			{
				expiresIn: "1h",
			}
		);

		res.status(200).json({
			token,
			user: {
				id: user._id,
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
				role: user.role,
			},
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message });
	}
};

export const getUsers = async (req, res) => {
	if (isAdmin(req, req.userId)) {
		try {
			const users = await User.find({});
			res.status(200).json(users);
		} catch (err) {
			res.status(500).json({ message: err.message });
		}
	} else {
		res.status(403).json({ message: "You do not have permission." });
	}
};

export const getUserByID = async (req, res) => {
	const id = req.params.id;

	try {
		let user = await User.findOne({ _id: id });
		const returnDetails = {
			user: {
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
				bio: user.bio,
				favorites: user.favorites,
				pets: user.pets,
				fostering: user.fostering,
				phoneNumber: user.phoneNumber,
				url: user.url,
			},
		};
		res.status(200).json(returnDetails);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const uploadPhoto = async (req, res) => {
	const { url } = req.body;
	// console.log(req.body);
	try {
		await User.updateOne({ _id: req.userId }, { $set: { url } });
		res.status(200).json({ message: "Upload successuful.", url });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const getMyProfile = async (req, res) => {
	const userId = req.userId;

	try {
		const user = await User.findOne({ _id: userId });
		const sendUser = {
			user: {
				firstName: user.firstName,
				lastName: user.lastName,
				picture: user.picture,
				email: user.email,
				phoneNumber: user.phoneNumber,
				pets: user.pets,
				favorites: user.favorites,
				fostering: user.fostering,
			},
		};
		res.status(200).json(sendUser);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
