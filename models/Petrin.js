const mongoose = require("mongoose");
const petrinSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["Pétrin Spirale"],
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
  model: {
    type: String,
    required: true,
  },
  farineCapacity: {
    type: String,
    required: true,
  },
  patteCapacity: {
    type: String,
    required: true,
  },
  volume: {
    type: String,
    required: true,
  },
  puissance: {
    type: String,
    required: true,
  },
  poids: {
    type: String,
    required: true,
  },
  dimensions: {
    type: String,
    required: true,
  },
  stock: {
    type: String,
    enum: ["available", "out_of_stock"],
    required: true,
  },
  images: {
    type: [String],
  },
});

module.exports = mongoose.model("Petrin", petrinSchema);
