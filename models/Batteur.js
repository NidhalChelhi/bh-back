const mongoose = require("mongoose");

const batteurSchema = new mongoose.Schema({
  slug: {
    type: String,
    unique: true,
  },
  category: {
    type: String,
    enum: ["Batteur Mélangeur"],
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
  cuveCapacity: {
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
  alimentation: {
    type: String,
    required: true,
  },
  vitesse: {
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

module.exports = mongoose.model("Batteur", batteurSchema);
