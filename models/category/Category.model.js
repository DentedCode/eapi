import CategorySchema from "./Category.schema.js";

export const insertCategory = catObj => {
	return new Promise(async (resolve, reject) => {
		try {
			const result = await CategorySchema(catObj).save();

			resolve(result);
		} catch (error) {
			reject(error);
		}
	});
};

export const getCategories = catObj => {
	return new Promise(async (resolve, reject) => {
		try {
			const result = await CategorySchema.find();

			resolve(result);
		} catch (error) {
			reject(error);
		}
	});
};

export const updateCategory = ({ _id, ...catData }) => {
	return new Promise(async (resolve, reject) => {
		try {
			const result = await CategorySchema.findByIdAndUpdate(
				{ _id },
				{ $set: catData },
				{
					new: true,
				}
			);

			resolve(result);
		} catch (error) {
			reject(error);
		}
	});
};

export const deleteCategories = catArg => {
	return new Promise(async (resolve, reject) => {
		try {
			const result = await CategorySchema.deleteMany({
				_id: {
					$in: catArg,
				},
			});

			resolve(result);
		} catch (error) {
			reject(error);
		}
	});
};
