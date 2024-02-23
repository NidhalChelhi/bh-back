const fs = require("fs");
const path = require("path");
const mimeTypes = require("mime-types");

// Controller function to serve images
const serveImage = (req, res) => {
  const { filename } = req.params;

  // Construct the path to the image file
  const imagePath = path.join(__dirname, "../uploads", filename);

  // Check if the file exists
  if (fs.existsSync(imagePath)) {
    // Read the file and send it in the response
    fs.readFile(imagePath, (err, data) => {
      if (err) {
        console.error("Error reading image file:", err);
        res.status(500).send("Internal Server Error");
      } else {
        // Set the appropriate content type header based on the file extension
        const contentType = mimeTypes.lookup(filename);
        res.setHeader(
          "Content-Type",
          contentType || "application/octet-stream"
        ); // Default to 'application/octet-stream' if MIME type is not found
        res.send(data);
      }
    });
  } else {
    // If the file does not exist, return a 404 Not Found response
    res.status(404).send("Not Found");
  }
};

module.exports = {
  serveImage,
};
