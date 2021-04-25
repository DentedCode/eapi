import express from "express";
const router = express.Router();

import { comparePassword } from "../helpers/bcrypt.helper.js";
import { createAccessJWT, createRefreshJWT } from "../helpers/jwt.helper.js";

import { loginValidation } from "../middlewares/formValidation.middleware.js";
import { getUserByEmail } from "../models/user/User.model.js";

router.all("*", (req, res, next) => {
	next();
});

router.post("/", loginValidation, async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await getUserByEmail(email);

		if (!user?._id) {
			return res
				.status(403)
				.json({ status: "error", message: "Invalid login details" });
		}

		const dbHashPass = user.password;
		const result = await comparePassword(password, dbHashPass);
		if (!result) {
			return res.json({ status: "error", message: "Invalid login details" });
		}

		const accessJWT = await createAccessJWT(user.email, user._id);
		const refreshJWT = await createRefreshJWT(user.email, user._id);

		user.password = undefined;
		user.refreshJWT = undefined;
		res.json({
			status: "success",
			message: "login success",
			user,
			accessJWT,
			refreshJWT,
		});
	} catch (error) {
		console.log(error);
		throw new Error(error.message);
	}
});

export default router;
