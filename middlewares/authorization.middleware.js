import { verifyAccessJwt } from "../helpers/jwt.helper.js";
import { getAccessJwtByToken } from "../models/session/Session.model.js";

const getUserSession = accessJWT => {
	return new Promise(async (resolve, reject) => {
		const sessionInfo = await getAccessJwtByToken(accessJWT);
		resolve(sessionInfo);
	});
};

export const userAuthorization = async (req, res, next) => {
	try {
		const { authorization } = req.headers;
		const verifyToken = await verifyAccessJwt(authorization);
		console.log(">>>", verifyToken);

		if (!verifyToken?.email) {
			return res.status(403).json({
				status: "error",
				message: "Unauthorized",
			});
		}

		//check if token is exist in database
		const info = await getUserSession(authorization);
		console.log(info);

		if (info.userId) {
			req.body._id = info.userId;
			next();
		}
	} catch (error) {
		console.log(error);
		res.status(403).json({
			status: "error",
			message: "Unauthorized",
		});
	}
};
