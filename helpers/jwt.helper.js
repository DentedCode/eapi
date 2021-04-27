import jwt from "jsonwebtoken";
import { storeAccessJwt } from "../models/session/Session.model.js";
import { storeRefreshJWT } from "../models/user/User.model.js";

export const createAccessJWT = (email, _id) => {
	return new Promise((resolve, reject) => {
		try {
			const accessJWT = jwt.sign({ email }, process.env.JWT_ACCESS_SECRET, {
				expiresIn: "15m",
			});

			if (accessJWT) {
				const newSession = {
					accessJWT,
					userId: _id,
				};
				storeAccessJwt(newSession);
			}

			resolve(accessJWT);
		} catch (error) {
			reject(error);
		}
	});
};

export const createRefreshJWT = (email, _id) => {
	return new Promise((resolve, reject) => {
		try {
			const refreshJWT = jwt.sign({ email }, process.env.JWT_REFRESH_SECRET, {
				expiresIn: "30d",
			});

			storeRefreshJWT(_id, refreshJWT);

			resolve(refreshJWT);
		} catch (error) {
			reject(error);
		}
	});
};

export const verifyAccessJwt = accessJWT => {
	try {
		const decoded = jwt.verify(accessJWT, process.env.JWT_ACCESS_SECRET);
		console.log(decoded);
		return Promise.resolve(decoded);
	} catch (error) {
		console.log(error.message);
		return Promise.resolve(false);
	}
};

// export const verifyRefreshJwt = refreshJWT => {
// 	jwt.verify(
// 		refreshJWT,
// 		process.env.JWT_REFRESH_SECRET,
// 		function (err, decoded) {
// 			return err ? Promise.reject(false) : Promise.resolve(decoded);
// 		}
// 	);
// };
export const verifyRefreshJwt = refreshJWT => {
	try {
		const decoded = jwt.verify(refreshJWT, process.env.JWT_REFRESH_SECRET);

		return Promise.resolve(decoded);
	} catch (error) {
		return Promise.reject(false);
	}
};
