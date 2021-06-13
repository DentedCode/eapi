import express from "express";
const router = express.Router();
import { v4 as uuidv4 } from "uuid";

import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIP_PRIVATE_KEY);

router.all("*", (req, res, next) => {
	next();
});

router.post("/", (req, res) => {
	const { token, product } = req.body;
	///
	console.log(token, product);
	const idempotencyKey = uuidv4();

	return stripe.customers
		.create({
			email: token.email,
			source: token.id,
		})
		.then(customer => {
			// have access to the customer object
			stripe.charges
				.create(
					{
						customer: customer.id, // set the customer id
						amount: product.total, // 25
						currency: "aud",
						description: "One-time setup fee",
						receipt_email: token.email,
					},
					{ idempotencyKey }
				)
				.then(result => {
					console.log(result);
					// store info in the database, this is the new order and send the order id to the frontend
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
export default router;
