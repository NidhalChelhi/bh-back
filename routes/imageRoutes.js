const express = require("express");
const router = express.Router();
const { serveImage } = require("../controllers/imageController");

// Route to serve images
router.get("/:filename", serveImage);

module.exports = router;
