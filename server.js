import dotenv from "dotenv";
dotenv.config();

import express from "express";
const app = express();
import path from "path";

import cors from "cors";
import morgan from "morgan";

const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(morgan("tiny"));

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "public")));

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
// parse application/json
app.use(express.json());

import mongoClient from "./config/db.js";
mongoClient();

//Auth middleware
import { userAuthorization } from "./middlewares/authorization.middleware.js";

// justpayment
import { v4 as uuidv4 } from "uuid";
import Stripe from "stripe";
const stripe = new Stripe("sk_test_XdKQAGDK5VxW7fkoAJRyl2r800QzPUYo03");

app.post("/payment", (req, res) => {
	const { product, token } = req.body;
	clg(product, token);

	const idempotencyKey = uuidv4();

	return stripe.customers
		.create({
			email: token.email,
			source: token.id,
		})
		.then(customer => {
			console.log("order success", customer);
			// have access to the customer object
			stripe.charges
				.create(
					{
						customer: customer.id, // set the customer id
						amount: token.amount, // 25
						currency: "aud",
						description: "One-time setup fee",
						receipt_email: token.email,
					},
					{ idempotencyKey }
				)
				.then(result => {
					res.send({
						status: "success",
						message: result,
					});
				})
				.catch(err => {
					console.log(err);
					res.send({ status: "error", message: error });
				});
		});
});

// LOAD ROUTERS
import loginRouter from "./routers/login.router.js";
import userRouter from "./routers/user.router.js";
import categoryRouter from "./routers/category.router.js";
import productRouter from "./routers/product.router.js";
import tokenRouter from "./routers/token.router.js";
import paymentRouter from "./routers/payment.router.js";

//USE APIS
app.use("/api/v1/login", loginRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/category", userAuthorization, categoryRouter);
app.use("/api/v1/product", userAuthorization, productRouter);
app.use("/api/v1/token", tokenRouter);
app.use("/api/v1/payment", paymentRouter);

//test success
app.use("/", (req, res) => {
	res.send("server, Ok");
});
//404 return

app.use((req, res, next) => {
	const error = new Error("Resources not found");
	error.status = 404;

	next(error);
});

//handle error
import { handleError } from "./utils/errorHandler.js";

app.use((error, req, res, next) => {
	handleError(error, res);
});

app.listen(PORT, error => {
	if (error) console.log(error);

	console.log(`Server is runn at http://localhost:${PORT}`);
});
