import express from "express";
const router = express.Router();
import slugify from "slugify";
import multer from "multer";

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

// Multer configuration

const ALLOWED_FILE_TYPE = {
	"image/png": "png",
	"image/jpeg": "jpeg",
	"image/jpg": "jpg",
};

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		let error = null;
		const isAllowed = ALLOWED_FILE_TYPE[file.mimetype];

		if (!isAllowed) {
			error = new Error(
				"Some of the file types are not allowd, Only images are allowed"
			);
			error.status = 400;
		}

		cb(error, "public/img/product");
	},
	filename: function (req, file, cb) {
		//he there.jpg ==> he-there-4646465.jpg
		const fileName = slugify(file.originalname.split(".")[0]);
		const extension = ALLOWED_FILE_TYPE[file.mimetype];
		const fullFileName = fileName + "-" + Date.now() + "." + extension;
		cb(null, fullFileName);
	},
});

var upload = multer({ storage: storage });

// End Multer configuration

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

router.post(
	"/",
	upload.array("images", 5),
	newProductValidation,
	async (req, res) => {
		try {
			const addNewProd = {
				...req.body,
				slug: slugify(req.body.name),
			};

			const basePath = `${req.protocol}://${req.get("host")}/img/product/`;
			const files = req.files;
			console.log(files);

			const images = [];

			files.map(file => {
				const imgFullPath = basePath + file.filename;

				images.push(imgFullPath);
			});

			const result = await insertProduct({
				...addNewProd,
				images,
			});
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
	}
);

router.put(
	"/",
	upload.array("images", 5),
	updateProductValidation,
	async (req, res) => {
		try {
			const { _id, imgToDelete, ...formDt } = req.body;

			const basePath = `${req.protocol}://${req.get("host")}/img/product/`;
			const files = req.files;
			let images = [];

			//new images
			files.map(file => {
				const imgFullPath = basePath + file.filename;
				images.push(imgFullPath);
			});

			//get images form database and filter them
			//old images and remove images
			if (imgToDelete?.length) {
				const deleteImgSource = imgToDelete.split(",");

				//get the product form database
				const prod = await getProductById(_id);
				if (prod.images.length) {
					const updatingImages = prod.images.filter(
						imgSource => !deleteImgSource.includes(imgSource)
					);

					images = [...images, ...updatingImages];
				}
			}

			const updateProduct = {
				...formDt,
				images,
			};

			const result = await updateProductById({ _id, updateProduct });

			console.log(result);
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
	}
);

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
