import ResitPinSchema from "./ResetPin.schema.js";

export const storeNewPin = async newObj => {
	try {
		const result = await ResitPinSchema(newObj).save();
		return result;
	} catch (error) {
		console.log(error);
	}
};
