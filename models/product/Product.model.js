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

export const getProductById = _id => {
	return new Promise(async (resolve, reject) => {
		try {
			const result = await ProdSchema.findById(_id);

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

export const updateProductById = ({ _id, updateProduct }) => {
	return new Promise(async (resolve, reject) => {
		try {
			const result = await ProdSchema.findByIdAndUpdate(
				{ _id },
				{
					$set: updateProduct,
				},
				{ new: true }
			);

			resolve(result);
		} catch (error) {
			reject(error);
		}
	});
};
