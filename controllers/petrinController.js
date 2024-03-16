const Petrin = require("../models/Petrin");
const slugify = require("slugify");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage }).array("images", 5);

exports.addPetrin = async (req, res) => {
  try {
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        console.error("Multer error:", err);
        return res
          .status(500)
          .json({ success: false, message: "File upload error" });
      } else if (err) {
        console.error("Unknown error:", err);
        return res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      }

      const {
        name,
        description,
        model,
        farineCapacity,
        patteCapacity,
        volume,
        puissance,
        poids,
        dimensions,
        stock,
      } = req.body;

      const images = req.files.map((file) => file.path);

      let slug = slugify(name, { lower: true, remove: /[*+~.()'"!:@]/g });

      let petrinsWithSameName = await Petrin.find({ name });

      if (petrinsWithSameName.length > 0) {
        const existingSlugs = petrinsWithSameName.map((petrin) => petrin.slug);

        let counter = 2;
        while (existingSlugs.includes(slug)) {
          slug = `${slug}-${counter}`;
          counter++;
        }
      }

      let category = "Pétrin Spirale";

      const newPetrin = new Petrin({
        slug,
        category,
        name,
        description,
        model,
        farineCapacity,
        patteCapacity,
        volume,
        puissance,
        poids,
        dimensions,
        stock,
        images,
      });

      await newPetrin.save();

      res.status(201).json({
        success: true,
        message: "Petrin Added successfully",
        petrin: newPetrin,
      });
    });
  } catch (error) {
    console.error("Error saving petrin:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.addPicturesToPetrin = async (req, res) => {
  try {
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        console.error("Multer error:", err);
        return res
          .status(500)
          .json({ success: false, message: "File upload error" });
      } else if (err) {
        console.error("Unknown error:", err);
        return res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      }

      const petrin = await Petrin.findOne({ slug: req.params.slug });

      if (!petrin) {
        return res
          .status(404)
          .json({ success: false, message: "Petrin not found" });
      }

      const newImages = req.files.map((file) => file.path);
      petrin.images.push(...newImages);
      await petrin.save();

      res.status(200).json({
        success: true,
        message: "Pictures added to petrin successfully",
        newImages,
      });
    });
  } catch (error) {
    console.error("Error adding pictures to petrin:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getPetrins = async (req, res) => {
  try {
    const petrins = await Petrin.find();
    res.json(petrins);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getPetrinBySlug = async (req, res) => {
  try {
    const petrin = await Petrin.findOne({ slug: req.params.slug });
    res.json(petrin);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updatePetrin = async (req, res) => {
  try {
    const {
      name,
      description,
      model,
      farineCapacity,
      patteCapacity,
      volume,
      puissance,
      poids,
      dimensions,
      stock,
      images,
    } = req.body;
    const updatedPetrin = await Petrin.findOneAndUpdate(
      { slug: req.params.slug },
      {
        name,
        description,
        model,
        farineCapacity,
        patteCapacity,
        volume,
        puissance,
        poids,
        dimensions,
        stock,
        images,
      },
      { new: true }
    );

    if (!updatedPetrin) {
      return res
        .status(404)
        .json({ success: false, message: "Petrin not found" });
    }

    res.status(200).json({
      success: true,
      message: "Petrin updated successfully",
      updatedPetrin,
    });
  } catch (error) {
    console.error("Error updating petrin:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.deletePetrin = async (req, res) => {
  try {
    const petrin = await Petrin.findOneAndDelete({ slug: req.params.slug });

    if (!petrin) {
      return res
        .status(404)
        .json({ success: false, message: "Petrin not found" });
    }

    res.status(200).json({
      success: true,
      message: "Petrin deleted successfully",
      petrin,
    });
  } catch (error) {
    console.error("Error deleting petrin:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
