import ResitPinSchema from "./ResetPin.schema.js";

export const storeNewPin = async newObj => {
	try {
		const result = await ResitPinSchema(newObj).save();
		return result;
	} catch (error) {
		console.log(error);
	}
};

export const findPin = async ({ otp, password }) => {
	return new Promise(async (resolve, reject) => {
		try {
			const result = await ResitPinSchema.findOne({ otp, password });
			console.log("db query", result);
			resolve(result);
		} catch (error) {
			console.log(error);
			reject(error);
		}
	});
};

export const deletePasswordResetPin = async _id => {
	return new Promise(async (resolve, reject) => {
		try {
			const result = await ResitPinSchema.findByIdAndDelete(_id);
			console.log("db query", result);
			resolve(result);
		} catch (error) {
			console.log(error);
			reject(error);
		}
	});
};
