import Product from "../models/Product.js";
import { getPredictedPrice } from "../utils/predictor.js";

// Create new product
export const createProduct = async (req, res) => {
	try {
		const productData = req.body;

		// Call ML model for predicted price
		const predicted_price = await getPredictedPrice(productData);

		const newProduct = new Product({
			...productData,
			predicted_price,
		});

		await newProduct.save();
		res.status(201).json(newProduct);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// Update product & auto-refresh predicted_price
export const updateProduct = async (req, res) => {
	try {
		const productId = req.params.id;
		let product = await Product.findById(productId);
		if (!product) return res.status(404).json({ message: "Product not found" });

		// Merge updates from request
		Object.assign(product, req.body);

		// Prepare clean data for predictor
		const productData = {
			actual_price: product.actual_price,
			selling_price: product.selling_price,
			ebay_price: product.ebay_price,
			stock: product.stock,
			demand_index: product.demand_index,
			user_interest: product.user_interest,
			sales: product.sales,
			day_of_week: product.day_of_week,
			season: product.season,
		};

		// Recalculate predicted price
		product.predicted_price = await getPredictedPrice(productData);

		// Save back to MongoDB
		await product.save();
		res.json(product);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// Get all products
export const getProducts = async (req, res) => {
	try {
		const products = await Product.find();
		res.json(products);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// Get single product
export const getProductById = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		if (!product) return res.status(404).json({ message: "Not found" });
		res.json(product);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// Delete product
export const deleteProduct = async (req, res) => {
	try {
		const productId = req.params.id;

		const product = await Product.findByIdAndDelete(productId);

		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}

		res.json({ message: "Product deleted successfully", product });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
