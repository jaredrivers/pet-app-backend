import express from "express";
import auth from "../middleware/auth.js";
import {
	signIn,
	updateUser,
	getUsers,
	getUserByID,
	uploadPhoto,
	getMyProfile,
} from "../controllers/users.js";

const router = express.Router();

router.post("/signin", signIn);
// router.get("/:id", getUser);
router.get("/:id/full", getUserByID);

// //reserved for user
router.post("/:id", auth, updateUser);
router.get("/profile/:id", auth, getMyProfile);
router.post("/:id/uploadphoto", auth, uploadPhoto);

// //reserved for admin
router.get("/", auth, getUsers);

export default router;
