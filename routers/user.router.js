import express from "express";
const router = express.Router();

import { hashPassword } from "../helpers/bcrypt.helper.js";
import { verifyAccessJwt } from "../helpers/jwt.helper.js";
import { userAuthorization } from "../middlewares/authorization.middleware.js";
import {
	newUserValidation,
	updatePasswordValidation,
} from "../middlewares/formValidation.middleware.js";
import {
	createUser,
	getUserById,
	deleteRefreshJwtByUserId,
	getUserByEmail,
	updateNewPassword,
} from "../models/user/User.model.js";
import { deleteAccessJwtByUserId } from "../models/session/Session.model.js";
import {
	findPin,
	storeNewPin,
	deletePasswordResetPin,
} from "../models/reset_pin/ResetPin.model.js";
import { getRandOTP } from "../helpers/otp.helper.js";
import { emailProcessor } from "../helpers/email.helper.js";

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

router.post("/otp", async (req, res) => {
	try {
		const { email } = req.body;

		//get user base on the email
		const adminUser = await getUserByEmail(email);

		////lots of work to be done
		if (adminUser?._id) {
			//1. create OTP
			const otpLength = 6;
			const otp = await getRandOTP(otpLength);
			//store otp in db
			const newOtp = {
				otp,
				email,
			};

			const result = await storeNewPin(newOtp);

			if (result?._id) {
				//2. email OTP to the admin

				const { otp, email } = result;
				console.log(otp, email);
				const mailInfo = {
					type: "OTP_REQUEST",
					otp,
					email,
				};
				emailProcessor(mailInfo);
			}
		}

		res.send({
			status: "success",
			message:
				"If your email is found in our system, we will send you the password rest instruction. IT may take upto 5min to arrive the email. Please check your junk/spam folder if you don't see email in  your inbox.",
		});
	} catch (error) {
		console.log(error);
		res.send({
			status: "error",
			message:
				"Error! There is some problem in our system, please try again later.",
		});
	}
});

router.post("/password", updatePasswordValidation, async (req, res) => {
	try {
		const { otp, password, email } = req.body;
		//////process
		//1. is otp valid
		const pinInfo = await findPin({ otp, email });
		console.log(pinInfo);
		if (pinInfo?._id) {
			//2. encrypt password
			const hashPass = await hashPassword(password);

			//3. update password in db
			if (hashPass) {
				const result = await updateNewPassword({
					email: pinInfo.email,
					hashPass,
				});

				//delete the reset pin
				deletePasswordResetPin(pinInfo._id);

				if (result._id) {
					//3. send email notification
					const emailObj = {
						type: "UPDATE_PASS_SUCCESS",
						email,
					};

					emailProcessor(emailObj);

					return res.send({
						status: "success",
						message: "Your password has been updated. You may login now!",
					});
				}
			}
		}
		res.send({
			status: "error",
			message:
				"Error! There is some problem in our system, please try again later.",
		});
	} catch (error) {
		console.log(error);
		res.send({
			status: "error",
			message:
				"Error! There is some problem in our system, please try again later.",
		});
	}
});

export default router;
