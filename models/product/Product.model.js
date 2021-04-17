import ProdSchema from "./Product.schema.js";

export const insertProduct = prodObj => {
	return new Promise(async (resolve, reject) => {
		try {
			const result = await ProdSchema(prodObj).save();

			resolve(result);
		} catch (error) {
			reject(error);
		}
	});
};

export const getProducts = () => {
	return new Promise(async (resolve, reject) => {
		try {
			const result = await ProdSchema.find();

			resolve(result);
		} catch (error) {
			reject(error);
		}
	});
};

export const deleteProduct = _id => {
	return new Promise(async (resolve, reject) => {
		try {
			const result = await ProdSchema.findByIdAndDelete(_id);

			resolve(result);
		} catch (error) {
			reject(error);
		}
	});
};
