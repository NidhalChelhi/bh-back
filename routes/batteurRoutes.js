const express = require("express");
const router = express.Router();
const batteurController = require("../controllers/batteurController");

router.post("/add", batteurController.addBatteur);

router.post("/add-picture/:slug", batteurController.addPicturesToBatteur);

router.get("/all", batteurController.getBatteurs);

router.get("/:slug", batteurController.getBatteurBySlug);

router.put("/edit/:slug", batteurController.updateBatteur);

router.delete("/delete/:slug", batteurController.deleteBatteur);

module.exports = router;
