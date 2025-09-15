import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import products from "./routes/products.js"; // ✅ default export router

import cors from "cors";
import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

dotenv.config();

const app = express();

// ✅ Allow requests from any origin & support credentials
app.use(
	cors({
		origin: "*", // Allow all origins
		credentials: true,
	})
);

app.use(express.json());

// ✅ Root health route (optional but good for testing/Render health check)
app.get("/", (req, res) => {
	res.json({ status: "API is running 🚀" });
});

// ✅ Use router correctly
app.use("/api/products", products);

app.use((req, res, next) => {
	console.log(`[${req.method}] ${req.url}`);
	next();
});

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	);
	next();
});

mongoose
	.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log("MongoDB connected");
		app.listen(process.env.PORT || 5000, () => {
			console.log(`Server running on port ${process.env.PORT || 5000}`);
		});
	})
	.catch((err) => console.error(err));
