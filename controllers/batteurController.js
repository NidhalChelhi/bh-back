const Batteur = require("../models/Batteur");
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

exports.addBatteur = async (req, res) => {
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
        cuveCapacity,
        puissance,
        poids,
        alimentation,
        vitesse,
        dimensions,
        stock,
      } = req.body;

      const images = req.files.map((file) => file.path);

      let slug = slugify(name, { lower: true, remove: /[*+~.()'"!:@]/g });

      let batteursWithSameName = await Batteur.find({ name });

      if (batteursWithSameName.length > 0) {
        const existingSlugs = batteursWithSameName.map(
          (batteur) => batteur.slug
        );

        let counter = 2;
        while (existingSlugs.includes(slug)) {
          slug = `${slug}-${counter}`;
          counter++;
        }
      }

      let category = "Batteur Mélangeur";

      const newBatteur = new Batteur({
        slug,
        category,
        name,
        description,
        model,
        cuveCapacity,
        puissance,
        poids,
        alimentation,
        vitesse,
        dimensions,
        stock,
        images,
      });

      await newBatteur.save();

      res.status(201).json({
        success: true,
        message: "Batteur Added successfully",
        batteur: newBatteur,
      });
    });
  } catch (error) {
    console.error("Error saving batteur:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.addPicturesToBatteur = async (req, res) => {
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

      const batteur = await Batteur.findOne({ slug: req.params.slug });

      if (!batteur) {
        return res
          .status(404)
          .json({ success: false, message: "Batteur not found" });
      }

      const newImages = req.files.map((file) => file.path);
      batteur.images.push(...newImages);
      await batteur.save();

      res.status(200).json({
        success: true,
        message: "Pictures added to batteur successfully",
        newImages,
      });
    });
  } catch (error) {
    console.error("Error adding pictures to batteur:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.getBatteurs = async (req, res) => {
  try {
    const batteurs = await Batteur.find();
    res.json(batteurs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getBatteurBySlug = async (req, res) => {
  try {
    const batteur = await Batteur.findOne({ slug: req.params.slug });
    res.json(batteur);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateBatteur = async (req, res) => {
  try {
    const {
      name,
      description,
      model,
      cuveCapacity,
      puissance,
      poids,
      alimentation,
      vitesse,
      dimensions,
      stock,
      images,
    } = req.body;
    const updatedBatteur = await Batteur.findOneAndUpdate(
      { slug: req.params.slug },
      {
        name,
        description,
        model,
        cuveCapacity,
        puissance,
        poids,
        alimentation,
        vitesse,
        dimensions,
        stock,
        images,
      },
      { new: true }
    );

    if (!updatedBatteur) {
      return res
        .status(404)
        .json({ success: false, message: "Batteur not found" });
    }

    res.status(200).json({
      success: true,
      message: "Batteur updated successfully",
      updatedBatteur,
    });
  } catch (error) {
    console.error("Error updating batteur:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.deleteBatteur = async (req, res) => {
  try {
    const batteur = await Batteur.findOneAndDelete({ slug: req.params.slug });

    if (!batteur) {
      return res
        .status(404)
        .json({ success: false, message: "Batteur not found" });
    }

    res.status(200).json({
      success: true,
      message: "Batteur deleted successfully",
      batteur,
    });
  } catch (error) {
    console.error("Error deleting batteur:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
