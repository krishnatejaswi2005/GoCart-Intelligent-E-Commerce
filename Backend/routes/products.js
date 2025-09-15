import express from "express";
import {
	createProduct,
	updateProduct,
	getProducts,
	getProductById,
	deleteProduct, // ✅ add this
} from "../controllers/productController.js";

const router = express.Router();

router.post("/", createProduct);
router.put("/:id", updateProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.delete("/:id", deleteProduct); // ✅ add this

export default router;
