import { create } from "zustand";

export const useProductStore = create((set) => ({
  products: [],
  setProducts: (products) => set({ products }),

  createProduct: async (newProduct) => {
    if (!newProduct.name || !newProduct.price || !newProduct.imageUrl) {
      return { success: false, message: "All fields are required" };
    }
    const res = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProduct),
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || res.statusText);
    }
    const data = await res.json();
    set((state) => ({ products: [...state.products, data.data] }));
    return { success: true, message: "Product created successfully" };
  },
  fetchProducts: async () => {
    const res = await fetch("/api/products");
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || res.statusText);
    }
    const data = await res.json();
    set({ products: data.data });
  },

  deleteProduct: async (productId) => {
    const res = await fetch(`/api/products/${productId}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!data.success)
      return {
        success: false,
        message: data.message || "Failed to delete product",
      };
    set((state) => ({
      products: state.products.filter((product) => product._id !== productId),
    }));
    return {
      success: true,
      message: data.message || "Product deleted successfully",
    };
  },
  updateProduct: async (productId, updatedProduct) => {
    const res = await fetch(`/api/products/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedProduct),
    });
  const { success, message, data } = await res.json();
    if (!success)
      return {
        success: false,
        message: message || "Failed to update product",
      };
    //Update the UI asap without refreshing the page
    set((state) => ({
      products: state.products.map((product) =>
        product._id === productId ? data: product
      ),
    }));
    return{success: true, message: message || "Product updated successfully"}
  },
}));
