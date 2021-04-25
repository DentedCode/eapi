import Joi from "joi";

const shortStr = Joi.string().max(100);
const longStr = Joi.string().max(2000);
const email = Joi.string().min(3).max(50).required();
const password = Joi.string().max(50).required();
const date = Joi.date().allow(null).allow("");
const num = Joi.number();
const args = Joi.array();
const boolean = Joi.boolean();

export const newUserValidation = (req, res, next) => {
	const schema = Joi.object({
		fName: shortStr.required(),
		lName: shortStr.required(),
		email,
		password,
		role: shortStr,
	});

	//validation
	const value = schema.validate(req.body);

	if (value.error) {
		return res.json({
			status: "error",
			message: value.error.message,
		});
	}

	next();
};

export const loginValidation = (req, res, next) => {
	const schema = Joi.object({ email, password });

	//validation
	const value = schema.validate(req.body);

	if (value.error) {
		return res.json({
			status: "error",
			message: value.error.message,
		});
	}

	next();
};

export const newProductValidation = (req, res, next) => {
	const categories = req.body.categories.length
		? req.body.categories.split(",")
		: [];

	req.body.categories = categories;

	const schema = Joi.object({
		name: shortStr.required(),
		qty: num.required(),
		status: boolean.required(),
		price: num.required(),
		salePrice: num,
		saleEndDate: date,
		description: longStr.required(),
		images: args,
		categories: args,
	});

	//validation
	const value = schema.validate(req.body);

	if (value.error) {
		return res.json({
			status: "error",
			message: value.error.message,
		});
	}

	next();
};

export const updateProductValidation = (req, res, next) => {
	req.body.saleEndDate =
		req.body.saleEndDate === "null" ? null : req.body.saleEndDate;

	const categories = req.body.categories.length
		? req.body.categories.split(",")
		: [];

	req.body.categories = categories;

	const schema = Joi.object({
		_id: shortStr.required(),
		status: boolean.required(),
		name: shortStr.required(),
		slug: shortStr.required(),
		qty: num.required(),

		price: num.required(),
		salePrice: num,
		saleEndDate: date,
		description: longStr.required(),
		images: args,
		imgToDelete: longStr,
		categories: args,
	});

	//validation
	const value = schema.validate(req.body);

	if (value.error) {
		return res.json({
			status: "error",
			message: value.error.message,
		});
	}

	next();
};

export const addCategoryValidation = (req, res, next) => {
	const schema = Joi.object({
		name: shortStr.required(),
		parentCat: shortStr.allow(null).allow("").optional(),
	});

	//validation
	const value = schema.validate(req.body);

	if (value.error) {
		return res.json({
			status: "error",
			message: value.error.message,
		});
	}

	next();
};

export const updateCategoryValidation = (req, res, next) => {
	console.log(req.body);

	const schema = Joi.object({
		_id: shortStr.required(),
		name: shortStr.required(),
		parentCat: shortStr.allow(null).allow(""),
	});

	//validation
	const value = schema.validate(req.body);

	if (value.error) {
		return res.json({
			status: "error",
			message: value.error.message,
		});
	}

	next();
};
