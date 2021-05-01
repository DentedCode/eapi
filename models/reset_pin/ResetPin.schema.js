import mongoose from "mongoose";

const SchemaResetPin = mongoose.Schema(
	{
		otp: {
			type: Number,
			require: true,
			default: null,
		},

		email: {
			type: String,
			require: true,
			default: "",
		},
	},
	{
		timestamp: true,
	}
);

const ResitPinSchema = mongoose.model("reset_pin", SchemaResetPin);

export default ResitPinSchema;
