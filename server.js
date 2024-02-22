const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 3001;
const cors = require("cors");

app.use(cors());

mongoose.connect("mongodb+srv://mje:mje@cluster0.zl4kexk.mongodb.net/products");

const productSchema = new mongoose.Schema({
  category: String,
  slug: String,
  images: [String],
  name: String,
  description: String,
});

const Product = mongoose.model("Product", productSchema);

app.use(express.json());

app.post("/api/products", async (req, res) => {
  try {
    const { category, slug, images, name, description } = req.body;
    const newProduct = new Product({
      category,
      slug,
      images,
      name,
      description,
    });
    await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product Added successfully",
      savedDate: newProduct.savedDate,
    });
  } catch (error) {
    console.error("Error saving feedback:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/products/:slug", async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
