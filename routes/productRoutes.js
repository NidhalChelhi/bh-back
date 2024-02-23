const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// POST endpoint for adding a new product
router.post("/add", productController.addProduct);

// POST endpoint for adding pictures to a product
router.post("/add-picture/:slug", productController.addPicturesToProduct);

// GET endpoint to fetch all products
router.get("/all", productController.getProducts);

// GET endpoint to fetch a product by slug
router.get("/:slug", productController.getProductBySlug);

// PUT endpoint to update a product
router.put("/edit/:slug", productController.updateProduct);

// DELETE endpoint to delete a product
router.delete("/delete/:slug", productController.deleteProduct);

module.exports = router;
