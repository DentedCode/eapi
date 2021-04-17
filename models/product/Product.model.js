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

// export const getCategories = catObj => {
// 	return new Promise(async (resolve, reject) => {
// 		try {
// 			const result = await CategorySchema.find();

// 			resolve(result);
// 		} catch (error) {
// 			reject(error);
// 		}
// 	});
// };

// export const deleteCategories = catArg => {
// 	return new Promise(async (resolve, reject) => {
// 		try {
// 			const result = await CategorySchema.deleteMany({
// 				_id: {
// 					$in: catArg,
// 				},
// 			});

// 			resolve(result);
// 		} catch (error) {
// 			reject(error);
// 		}
// 	});
// };
