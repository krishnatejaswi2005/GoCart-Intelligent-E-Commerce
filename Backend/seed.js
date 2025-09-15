import mongoose from "mongoose";
import dotenv from "dotenv";
import axios from "axios";
import Product from "./models/Product.js"; // ✅ adjust path if needed

dotenv.config();

const products = [
	{
		name: "Gaming Laptop X1",
		description: "16GB RAM, RTX GPU",
		actual_price: 40000,
		selling_price: 42000,
		ebay_price: 45000,
		stock: 5,
		demand_index: 0.1,
		user_interest: 0.15,
		sales: 2,
		day_of_week: 1,
		season: 0,
		imageUrl: "https://example.com/laptop-x1.jpg",
		review: "Decent performance for the price.",
	},
	{
		name: "Gaming Laptop X2",
		description: "32GB RAM, RTX 4070",
		actual_price: 42000,
		selling_price: 44000,
		ebay_price: 47000,
		stock: 6,
		demand_index: 0.12,
		user_interest: 0.2,
		sales: 3,
		day_of_week: 2,
		season: 1,
		imageUrl: "https://example.com/laptop-x2.jpg",
		review: "Handles AAA titles with ease.",
	},
];

// 👉 Function to call FastAPI prediction
const getPrediction = async (product) => {
	try {
		const { data } = await axios.post(process.env.FASTAPI_URL, {
			actual_price: product.actual_price,
			selling_price: product.selling_price,
			ebay_price: product.ebay_price,
			stock: product.stock,
			demand_index: product.demand_index,
			user_interest: product.user_interest,
			sales: product.sales,
			day_of_week: product.day_of_week,
			season: product.season,
		});

		return data; // { predicted_price, action_adjustment, ... }
	} catch (err) {
		console.error("Prediction API error:", err.message);
		return {};
	}
};

const seedDB = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});

		console.log("MongoDB connected for seeding...");

		// clear old products
		await Product.deleteMany();
		console.log("Old products removed");

		// insert with predictions
		for (let prod of products) {
			const prediction = await getPrediction(prod);
			const newProduct = new Product({ ...prod, ...prediction });
			await newProduct.save();
		}

		console.log("Seeding done ✅");
		mongoose.connection.close();
	} catch (err) {
		console.error("Seeding error:", err);
		mongoose.connection.close();
	}
};

seedDB();
