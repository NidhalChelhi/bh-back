const mongoose = require("mongoose");
const slugify = require("slugify");

const productSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ["Mixeurs", "Mélangeurs"],
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  stock: {
    type: String,
    enum: ["available", "out_of_stock", "coming_soon"],
    default: "available",
  },
  images: {
    type: [String],
    required: true,
  },
  slug: {
    type: String,
    unique: true,
  },
});

// Autogenerate slug before saving
productSchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});

// Indexing the slug for faster retrieval
productSchema.index({ slug: 1 });

module.exports = mongoose.model("Product", productSchema);
