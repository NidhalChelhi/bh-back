const express = require("express");
const cors = require("cors");
const connectToDatabase = require("./database");
const productRoutes = require("./routes/productRoutes");
const imageRoutes = require("./routes/imageRoutes");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to the database
connectToDatabase();

// Routes
app.use("/api/products", productRoutes);
app.use("/api/uploads", imageRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
