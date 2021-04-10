import express from "express";
const router = express.Router();

import { loginValidation } from "../middlewares/formValidation.middleware.js";
import {
	createUser,
	getUserByEmailPassword,
} from "../models/user/User.model.js";

router.all("*", (req, res, next) => {
	next();
});

router.post("/", loginValidation, async (req, res) => {
	try {
		const result = await getUserByEmailPassword(req.body);

		console.log(result);
		if (result?._id) {
			return res.json({ status: "success", message: "login success", result });
		}

		res.json({ status: "error", message: "Invalid login details" });
	} catch (error) {
		console.log(error);
		throw new Error(error.message);
	}
});

// router.post();

export default router;
