import express from "express";
import {
	createPet,
	getPetById,
	getAllPets,
	deletePet,
	editPet,
	adoptPet,
	returnPet,
	savePet,
	getUserPets,
	searchPets,
	fosterPet,
	// getMyPets,
} from "../controllers/pets.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/all", getAllPets);
router.get("/:id", getPetById);
router.get("/user/:id", getUserPets);

// protected for logged in user
router.post("/search", searchPets);
router.post("/:id/return", auth, returnPet);
router.post("/:id/save", auth, savePet);
router.post("/:id/foster", auth, fosterPet);
router.post("/:id/adopt", auth, adoptPet);
router.delete("/:id/save", auth, deletePet);
// router.get("/:id/mypets", auth, getMyPets);

//protected for admins
router.put("/:id", auth, editPet);
router.post("/", auth, createPet);

export default router;
