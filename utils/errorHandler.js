export const handleError = (error, res) => {
	console.log(error);

	res.status(error.status || 500);

	res.json({
		status: "error",
		message: error.message,
	});
};
