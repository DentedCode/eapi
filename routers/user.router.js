import express from "express";
const router = express.Router();

import { hashPassword } from "../helpers/bcrypt.helper.js";
import { verifyAccessJwt } from "../helpers/jwt.helper.js";
import { userAuthorization } from "../middlewares/authorization.middleware.js";
import { newUserValidation } from "../middlewares/formValidation.middleware.js";
import {
	createUser,
	getUserById,
	deleteRefreshJwtByUserId,
} from "../models/user/User.model.js";
import { deleteAccessJwtByUserId } from "../models/session/Session.model.js";

router.all("*", (req, res, next) => {
	next();
});

router.get("/", userAuthorization, async (req, res) => {
	try {
		const { _id } = req.body;

		if (!_id) {
			return res.send({
				status: "error",
				message: "Invalid request!",
			});
		}

		const user = await getUserById(_id);

		if (user) user.password = undefined;

		user._id
			? res.send({
					status: "success",
					message: "Welcome to your profile",
					user,
			  })
			: res.send({
					status: "error",
					message: "Invalid request",
			  });
	} catch (err) {
		// const error = new Error(err.message);
		// error.statusCode = 400;
		// throw error;
		res.send({
			status: "error",
			message: "Invalid request",
		});
	}
});

router.post("/", newUserValidation, async (req, res) => {
	try {
		const { password } = req.body;

		const hashPass = await hashPassword(password);

		const newUser = {
			...req.body,
			password: hashPass,
		};

		const result = await createUser(newUser);
		if (result?._id) {
			return res.json({ status: "success", message: "login success", result });
		}

		res.json({ status: "error", message: "Invalid login details" });
	} catch (error) {
		console.log(error.message);

		if (error.message.includes("duplicate key error collection")) {
			return res.json({ status: "error", message: "This email already exist" });
		}

		throw new Error(error.message);
	}
});

router.post("/logout", async (req, res) => {
	try {
		const { _id } = req.body;
		// const {accessJWT, refreshJWT} = req.body

		//delete accessJWT from session database
		deleteAccessJwtByUserId(_id);

		//delete refreshJWT form user table.
		deleteRefreshJwtByUserId(_id);

		res.send({
			status: "success",
			message: "You are logged out now!",
		});
	} catch (error) {
		console.log(error);
		res.send({
			status: "error",
			message: "OOp! something we wrong. couldn't complete the process",
		});
	}
});

export default router;
