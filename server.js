import express from "express";
const app = express();

import cors from "cors";
import morgan from "morgan";

const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(morgan("tiny"));

app.get("/", (req, res) => {
	res.send("Hello World");
});

app.listen(PORT, error => {
	if (error) console.log(error);

	console.log(`Server is runn at http://localhost:${PORT}`);
});
