import express from "express";

import {
  createAProduct,
  getAllProducts,
  updateAProduct,
  deleteAProduct,
} from "../controllers/productController.js";
const router = express.Router();

// Create a new product
router.post("/", createAProduct);
// Get all products
router.get("/", getAllProducts);
router.put("/:productId", updateAProduct); // Update a product

// Delete a product

router.delete("/:productId", deleteAProduct);

// Export the router
export default router;
