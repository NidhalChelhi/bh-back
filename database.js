const mongoose = require("mongoose");

async function connectToDatabase() {
  try {
    await mongoose.connect(
      "mongodb+srv://mje:mje@cluster0.zl4kexk.mongodb.net/products"
    );
    console.log("Connected to the database");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}

module.exports = connectToDatabase;
