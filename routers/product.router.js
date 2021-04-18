import express from "express";
const router = express.Router();
import slugify from "slugify";

import {
	newProductValidation,
	updateProductValidation,
} from "../middlewares/formValidation.middleware.js";

import {
	insertProduct,
	getProducts,
	deleteProduct,
	getProductById,
	updateProductById,
} from "../models/product/Product.model.js";

router.all("*", (req, res, next) => {
	next();
});

router.get("/:_id?", async (req, res) => {
	const { _id } = req.params;
	try {
		const result = _id ? await getProductById(_id) : await getProducts();

		res.json({
			status: "success",
			message: "Here are all the products",
			result,
		});
	} catch (error) {
		throw error;
	}
});

router.post("/", newProductValidation, async (req, res) => {
	try {
		const addNewProd = {
			...req.body,
			slug: slugify(req.body.name),
		};

		const result = await insertProduct(addNewProd);
		console.log(result);

		if (result._id) {
			return res.json({
				status: "success",
				message: "The product has been added!",
				result,
			});
		}

		res.json({
			status: "error",
			message: "Unable to add the product, Please try again later",
		});
	} catch (error) {
		throw error;
	}
});

router.put("/", updateProductValidation, async (req, res) => {
	const { _id, ...formDt } = req.body;
	try {
		const result = await updateProductById({ _id, formDt });

		if (result?._id) {
			return res.json({
				status: "success",
				message: "The product has been updated",
				result,
			});
		}

		res.json({
			status: "error",
			message: "Unable to update the product, Please try again later",
			result,
		});
	} catch (error) {
		throw error;
	}
});

router.delete("/", async (req, res) => {
	try {
		if (!req.body) {
			return res.json({
				status: "error",
				message: "Unable to add the product, Please try again later",
			});
		}

		const result = await deleteProduct(req.body);
		console.log(result);

		if (result?._id) {
			return res.json({
				status: "success",
				message: "The product has been deleted.",
				result,
			});
		}

		res.json({
			status: "error",
			message: "Unable to delete the product, Please try again later",
		});
	} catch (error) {
		console.log(error);
		throw error;
	}
});

export default router;
