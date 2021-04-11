import express from "express";
const router = express.Router();

import {
	getCategories,
	insertCategory,
} from "../models/category/Category.model.js";

router.all("*", (req, res, next) => {
	next();
});

router.get("/", async (req, res) => {
	try {
		const result = await getCategories();
		res.json({
			status: "success",
			message: "Fetching success",
			result,
		});
	} catch (error) {
		console.log(error);
		throw new Error(error.message);
	}
});

router.post("/", async (req, res) => {
	console.log(req.body);
	try {
		const result = await insertCategory(req.body);
		res.json({
			status: "success",
			message: "New Category saved",
			result,
		});
	} catch (error) {
		console.log(error);
		throw new Error(error.message);
	}
});

export default router;
