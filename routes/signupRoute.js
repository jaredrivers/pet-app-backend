import express from "express";
import { signUp } from "../controllers/users.js";

const router = express.Router();

router.post("/", signUp);

export default router;
