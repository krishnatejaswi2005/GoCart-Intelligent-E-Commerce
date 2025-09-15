import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
	{
		user: { type: String, required: true },
		comment: { type: String, required: true },
		rating: { type: Number, min: 1, max: 5, required: true },
	},
	{ timestamps: true }
);

const productSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		description: { type: String },
		actual_price: { type: Number, required: true },
		selling_price: { type: Number, required: true },
		ebay_price: { type: Number },
		stock: { type: Number, required: true },
		demand_index: { type: Number },
		user_interest: { type: Number },
		sales: { type: Number },
		day_of_week: { type: Number },
		season: { type: Number },
		image_url: { type: String }, // 📌 display only
		reviews: [reviewSchema], // 📌 display only
		predicted_price: { type: Number, default: 0 }, // 📌 stored at root
	},
	{ timestamps: true }
);

export default mongoose.model("Product", productSchema);
