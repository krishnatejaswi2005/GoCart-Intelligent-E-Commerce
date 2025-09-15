// predictor.js
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export async function getPredictedPrice(productData) {
	try {
		const response = await axios.post(`${process.env.FASTAPI_URL}`, {
			actual_price: productData.actual_price,
			selling_price: productData.selling_price,
			ebay_price: productData.ebay_price,
			stock: productData.stock,
			demand_index: productData.demand_index,
			user_interest: productData.user_interest,
			sales: productData.sales,
			day_of_week: productData.day_of_week,
			season: productData.season,
		});

		return response.data.predicted_price;
	} catch (error) {
		console.error("Prediction API error:", error.message);
		return productData.selling_price; // fallback
	}
}
