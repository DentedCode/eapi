import mongoose from "mongoose";

const CategorySchema = mongoose.Schema(
	{
		name: {
			type: String,
			require: true,
			default: "",
		},
		slug: {
			type: String,
			require: true,
			default: "",
		},
		parentCat: {
			type: mongoose.Schema.ObjectId,
			default: null,
		},
	},
	{
		timestamp: true,
	}
);

const CatSchema = mongoose.model("Category", CategorySchema);

export default CatSchema;
