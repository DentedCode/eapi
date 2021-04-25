import mongoose from "mongoose";

const SchemaSession = mongoose.Schema(
	{
		accessJWT: {
			type: String,
			require: true,
			default: "",
		},

		userId: {
			type: mongoose.Schema.ObjectId,
			default: null,
		},
	},
	{
		timestamp: true,
	}
);

const SessionSchema = mongoose.model("Session", SchemaSession);

export default SessionSchema;
