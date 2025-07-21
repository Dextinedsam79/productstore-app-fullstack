import Product from "../models/productModel.js";
import mongoose from "mongoose";

export const createAProduct = async (req, res) => {
  const { name, price, imageUrl } = req.body;

  // Basic validation
  if (!name || price == null || !imageUrl) {
    return res.status(400).json({
      success: false,
      message: "Please provide name, price, and imageUrl",
    });
  }

  if (
    typeof name !== "string" ||
    typeof price !== "number" ||
    typeof imageUrl !== "string"
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid data types for name, price, or imageUrl",
    });
  }

  try {
    //  Check first to give a nicer error
    const existing = await Product.findOne({ name });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: `A product with the name "${name}" already exists.`,
      });
    }

    // Create & save
    const newProduct = new Product({ name, price, imageUrl });
    await newProduct.save();

    return res.status(201).json({
      success: true,
      message: "Product created",
      data: newProduct,
    });

  } catch (error) {
    console.error("Error saving product:", error);

    //  Catch unique‐index violation as a fallback
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: `Duplicate product name: "${name}".`,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 }); // Sort by createdAt in descending order
    if (!products || products.length === 0) {
        return res.status(404).json({
            success: false,
            message: "No products found",
        });
        }
    // If products are found, return them
    console.log("Products fetched successfully:", products);
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export const updateAProduct = async (req, res) => {
  const { productId } = req.params;
  const updates = req.body;

  // 1. ID validation
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid product ID" });
  }

  // 2. Optional: check for duplicate name if the client is trying to update `name`
  if (updates.name) {
    const existing = await Product.findOne({ name: updates.name });
    if (existing && existing._id.toString() !== productId) {
      return res
        .status(409)
        .json({
          success: false,
          message: `Another product with name "${updates.name}" already exists.`
        });
    }
  }

  try {
    // 3. Perform the update
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updates,
      { new: true, runValidators: true }
    );

    // 4. Handle not‑found
    if (!updatedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // 5. Success
    console.log("Product updated successfully:", updatedProduct);
    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });

  } catch (error) {
    console.error("Error updating product:", error);

    // 6. Catch unique‑index violation (race‑condition fallback)
    if (error.code === 11000) {
      return res
        .status(409)
        .json({
          success: false,
          message: `Duplicate product name: "${updates.name}".`
        });
    }

    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}

export const deleteAProduct = async (req, res) => {
  const { productId } = req.params; // Extract productId from request parameters
  try {
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res
      .status(200)
      .json({
        success: true,
        message: "Product deleted successfully",
        data: deletedProduct,
      });
  } catch (error) {
    console.error("Error deleting product:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}