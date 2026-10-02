const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const Category = require("./models/Category");
const Product = require("./models/Product");

const app = express();

// Middleware

app.use(cors());

app.use(express.json());

// MongoDB connection

mongoose
  .connect("mongodb://127.0.0.1:27017/ShoppingCart")
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.log("MongoDB error:", error);
  });

// =====================================
// CATEGORY CRUD
// =====================================

// Add category

app.post("/api/categories", async (req, res) => {
  try {
    const category = new Category({
      name: req.body.name,
    });

    await category.save();

    res.json({
      message: "Category added",
      category: category,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding category",
    });
  }
});

// Get categories

app.get("/api/categories", async (req, res) => {
  const categories = await Category.find();

  res.json(categories);
});

// Update category

app.put("/api/categories/:id", async (req, res) => {
  await Category.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
  });

  res.json({
    message: "Category updated",
  });
});

// Delete category

app.delete("/api/categories/:id", async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);

  res.json({
    message: "Category deleted",
  });
});

// =====================================
// PRODUCT CRUD
// =====================================

// Add product

app.post("/api/products", async (req, res) => {
  try {
    const product = new Product({
      name: req.body.name,

      price: req.body.price,

      quantity: req.body.quantity,

      category: req.body.category,
    });

    await product.save();

    res.json({
      message: "Product added",
      product: product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding product",
    });
  }
});

// Get all products

app.get("/api/products", async (req, res) => {
  const products = await Product.find().populate("category");

  res.json(products);
});

// Get products by category

app.get("/api/products/category/:categoryId", async (req, res) => {
  const products = await Product.find({
    category: req.params.categoryId,
  }).populate("category");

  res.json(products);
});

// Update product

app.put("/api/products/:id", async (req, res) => {
  await Product.findByIdAndUpdate(
    req.params.id,

    {
      name: req.body.name,

      price: req.body.price,

      quantity: req.body.quantity,

      category: req.body.category,
    },
  );

  res.json({
    message: "Product updated",
  });
});

// Delete product

app.delete("/api/products/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);

  res.json({
    message: "Product deleted",
  });
});

// =====================================
// START SERVER
// =====================================

app.listen(5000, () => {
  console.log("Server running at http://localhost:5000");
});
