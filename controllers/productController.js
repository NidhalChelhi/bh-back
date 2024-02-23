const Product = require("../models/Product");
const slugify = require("slugify");
const multer = require("multer");

// Multer configuration for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Destination folder for storing uploaded images
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // File naming scheme to avoid conflicts
  },
});

const upload = multer({ storage: storage }).array("images", 5); // Allowing up to 5 images to be uploaded

exports.addProduct = async (req, res) => {
  try {
    // Upload images first
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading
        console.error("Multer error:", err);
        return res
          .status(500)
          .json({ success: false, message: "File upload error" });
      } else if (err) {
        // An unknown error occurred when uploading
        console.error("Unknown error:", err);
        return res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      }

      // Images uploaded successfully, continue saving product
      const { name, description, stock, category } = req.body;
      console.log(req.body);
      console.log(req.files);
      const images = req.files.map((file) => file.path); // Retrieve uploaded image paths
      // Generate slug from the name
      let slug = slugify(name, { lower: true, remove: /[*+~.()'"!:@]/g });
      // Check if a product with the same name exists
      let productsWithSameName = await Product.find({ name });

      // If products with the same name exist, append a number to the slug
      if (productsWithSameName.length > 0) {
        const existingSlugs = productsWithSameName.map(
          (product) => product.slug
        );

        let counter = 2;
        while (existingSlugs.includes(slug)) {
          slug = `${slug}-${counter}`;
          counter++;
        }
      }

      const newProduct = new Product({
        category,
        slug,
        images,
        name,
        description,
        stock,
      });

      await newProduct.save();

      res.status(201).json({
        success: true,
        message: "Product Added successfully",
        product: newProduct,
      });
    });
  } catch (error) {
    console.error("Error saving product:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Endpoint to add pictures to a product
exports.addPicturesToProduct = async (req, res) => {
  try {
    // Upload images
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading
        console.error("Multer error:", err);
        return res
          .status(500)
          .json({ success: false, message: "File upload error" });
      } else if (err) {
        // An unknown error occurred when uploading
        console.error("Unknown error:", err);
        return res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      }

      // Images uploaded successfully, retrieve the product
      const product = await Product.findOne({ slug: req.params.slug });

      if (!product) {
        return res
          .status(404)
          .json({ success: false, message: "Product not found" });
      }

      // Add the uploaded image paths to the product's images array
      const newImages = req.files.map((file) => file.path);
      product.images.push(...newImages);
      await product.save();

      res.status(200).json({
        success: true,
        message: "Pictures added to product successfully",
        newImages,
      });
    });
  } catch (error) {
    console.error("Error adding pictures to product:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { name, description, stock, images, category } = req.body;
    const updatedProduct = await Product.findOneAndUpdate(
      { slug: req.params.slug },
      { name, description, stock, images, category },
      { new: true }
    );

    if (!updatedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ slug: req.params.slug });

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      product,
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
