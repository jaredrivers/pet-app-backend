import Pet from "../models/petModel.js";
import User from "../models/userModel.js";
import isAdmin from "../functions/isAdmin.js";

export const getPetById = async (req, res) => {
	const id = req.params.id;
	try {
		const pet = await Pet.find({ _id: id });
		res.status(200).json(pet);
	} catch (err) {
		res.status(404).json({ message: err.message });
	}
};

export const getAllPets = async (req, res) => {
	try {
		const petList = await Pet.find({});
		res.status(200).json(petList);
	} catch (err) {
		res.status(500).json(err.message);
	}
};

export const createPet = async (req, res) => {
	const user = await User.findOne({ _id: req.userId });

	if (user.role === "admin") {
		const {
			name,
			type,
			adoptionStatus,
			height,
			weight,
			color,
			bio,
			hypoallergnic,
			dietery,
			breed,
			tags,
			url,
		} = req.body;
		try {
			const newPet = await Pet.create({
				name,
				type,
				adoptionStatus,
				height,
				weight,
				color,
				bio,
				hypoallergnic,
				dietery,
				breed,
				tags,
				url,
			});
			res.status(201).json({ pet: newPet });
		} catch (err) {
			res.status(409).json({ message: err.message });
		}
	} else {
		console.log("user is not admin");
		res.status(403).json({ message: "403 Forbidden" });
	}
};

export const deletePet = async (req, res) => {
	const petId = req.params.id;

	if (isAdmin(req, req.userId)) {
		try {
			const doc = await Pet.findOneAndDelete({ _id: petId });
			res.status(200).json({ message: `Sucessfully removed ${doc.name}` });
		} catch (err) {
			res.status(500).json({ message: err.message });
		}
	} else {
		res.status(403).json({ message: "You do not have permission." });
	}
};

export const editPet = async (req, res) => {
	const petId = req.params.id;
	const {
		name,
		type,
		adoptionStatus,
		height,
		weight,
		color,
		bio,
		hypoallergnic,
		dietery,
		breed,
		tags,
		url,
	} = req.body;

	if (isAdmin(req, req.userId)) {
		const doc = await Pet.findOne({ _id: petId });
		try {
			doc.overwrite({
				name,
				type,
				adoptionStatus,
				height,
				weight,
				color,
				bio,
				hypoallergnic,
				dietery,
				breed,
				tags,
			});
			await doc.save();
			res.status(200).json({ message: "Update successful." });
		} catch (err) {
			res.status(500).json({ message: err.message });
		}
	} else {
		res.status(403).json({ message: "You do not have permission." });
	}
};

export const adoptPet = async (req, res) => {
	const petId = req.params.id;
	const userId = req.userId;
	let user = await User.findOne({ _id: userId });

	if (user.pets.includes(petId)) {
		try {
			res.status(200).json({ message: "You already adopted this pet." });
		} catch (err) {
			res.status(500).json({ message: err.message });
		}
	} else {
		try {
			await Pet.updateOne(
				{ _id: petId },
				{ $set: { adoptionStatus: "Adopted" } }
			);
			await User.updateOne({ _id: req.userId }, { $push: { pets: petId } });
			let user = await User.findOne({ _id: userId });
			res.status(200).json(user.pets);
		} catch (err) {
			res.status(500).json({ message: err.message });
		}
	}
};

export const returnPet = async (req, res) => {
	const userId = req.userId;
	const petId = req.params.id;
	console.log(petId);

	try {
		let pet = await Pet.findOne({ _id: petId });

		if (pet.adoptionStatus === "Fostered") {
			await User.updateOne({ _id: userId }, { $pull: { fostering: petId } });
		} else {
			await User.updateOne({ _id: userId }, { $pull: { pets: petId } });
		}
		await Pet.updateOne(
			{ _id: petId },
			{ $set: { adotionStatus: "Available" } }
		);

		let user = await User.findOne({ _id: userId });
		res.status(200).json({ ownedPets: user.pets, fostering: user.fostering });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const savePet = async (req, res) => {
	const userId = req.userId;
	const petId = req.params.id;
	let user = await User.findOne({ _id: userId });

	if (user.favorites.includes(petId)) {
		try {
			await User.updateOne({ _id: userId }, { $pull: { favorites: petId } });
			user = await User.findOne({ _id: userId });
			res.status(200).json(user.favorites);
		} catch (err) {
			res.status(500).json({ message: err.message });
		}
	} else {
		try {
			await User.updateOne({ _id: userId }, { $push: { favorites: petId } });
			user = await User.findOne({ _id: userId });
			res.status(200).json(user.favorites);
		} catch (err) {
			res.status(500).json({ message: err.message });
		}
	}
};

export const getUserPets = async (req, res) => {
	const id = req.params.id;
	try {
		const user = await User.findOne({ _id: id });
		res.status(200).json({ pets: user.pets, favorites: user.favorites });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

export const searchPets = async (req, res) => {
	const { type, hypoallergnic, adoptionStatus, breed, color } = req.body;
	const results = [];

	try {
		const colorRes = await Pet.find({ color });
		if (colorRes.length !== 0) {
			for (let item of colorRes) {
				results.push(item);
			}
		}
		const breedRes = await Pet.find({ breed });
		if (breedRes.length !== 0) {
			for (let item of breedRes) {
				results.push(item);
			}
		}
		const statusRes = await Pet.find({ adoptionStatus });
		if (statusRes.length !== 0) {
			for (let item of statusRes) {
				results.push(item);
			}
		}
		const hypoRes = await Pet.find({ hypoallergnic });
		if (hypoRes.length !== 0) {
			for (let item of hypoRes) {
				results.push(item);
			}
		}
		const typeRes = await Pet.find({ type });
		if (typeRes.length !== 0) {
			for (let item of typeRes) {
				results.push(item);
			}
		}
		``;
		res.status(200).json(uniqueResults);
	} catch (err) {
		res.status(404).json({
			message: "Nothing found with that criteria. Try expanding your search.",
		});
	}
};

export const fosterPet = async (req, res) => {
	const userId = req.userId;
	const petId = req.params.id;
	let user = await User.findOne({ _id: userId });

	if (user.fostering.includes(petId)) {
		try {
			res.status(200).json({ message: "You are already fostering this pet." });
		} catch (err) {
			res.status(500).json({ message: err.message });
		}
	} else {
		try {
			await User.updateOne({ _id: userId }, { $push: { fostering: petId } });
			await Pet.updateOne(
				{ _id: petId },
				{ $set: { adoptionStatus: "Fostered" } }
			);
			user = await User.findOne({ _id: userId });
			res.status(200).json(user.fostering);
		} catch (err) {
			res.status(500).json({ message: err.message });
		}
	}
};

// export const getMyPets = async (req, res) => {
// 	const userId = req.userId;
// 	var petList = { favorites: {}, ownedPets: {}, fostering: {} };

// 	try {
// 		let user = await User.findOne({ _id: userId });
// 		for (let petId of user.favorites) {
// 			let pet = await Pet.findOne({ _id: petId });
// 			petList.favorites = { ...petList.favorites, pet };
// 		}
// 		res.status(200).json(petList);
// 	} catch (err) {
// 		res.status(500).json({ message: err.message });
// 	}
// };
