import express from "express";
import { getUserByEmailAndRefreshJWT } from "../models/user/User.model.js";
import { verifyRefreshJwt, createAccessJWT } from "../helpers/jwt.helper.js";
const router = express.Router();

router.all("*", (req, res, next) => {
	next();
});

//receive refreshJWT and return new accessJWT
router.get("/", async (req, res) => {
	try {
		const { authorization } = req.headers;
		if (authorization) {
			// Process: call the function to get the accessjwt

			// 1. verify storeRefreshJWT
			const { email } = await verifyRefreshJwt(authorization);

			// 3. find out the user who the code belongs to
			if (email) {
				// 2. check if it is in the database
				const user = await getUserByEmailAndRefreshJWT({
					email,
					refreshJWT: authorization,
				});

				if (user._id) {
					const tokenExp = user.refreshJWT.addedAt;
					tokenExp.setDate(
						tokenExp.getDate() + +process.env.JWT_REFRESH_SECRET_EXP_DAY
					);
					const today = Date.now();
					// check if token is still valid
					if (tokenExp > today) {
						// 4. cretae new accessJWT and store in the seesion table in BD
						const accessJwt = await createAccessJWT(email, user._id);
						return res.json({
							status: "success",
							message: "Here is your new accessJWT",
							accessJwt,
						});

						// 3. find out the user who the code belongs to
					}
				}
			}
		}

		res.status(403).json({
			status: "error",
			message: "Unauthorized!",
		});
	} catch (error) {
		res.status(403).json({
			status: "error",
			message: "Unauthorized!",
		});
	}
});

export default router;
