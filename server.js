const express = require("express");
const cors = require("cors");
const connectToDatabase = require("./database");
const batteurRoutes = require("./routes/batteurRoutes");
const petrinRoutes = require("./routes/petrinRoutes");
const imageRoutes = require("./routes/imageRoutes");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

connectToDatabase();

app.use("/api/batteurs", batteurRoutes);
app.use("/api/petrins", petrinRoutes);
app.use("/api/uploads", imageRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
