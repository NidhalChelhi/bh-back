const express = require("express");
const router = express.Router();
const petrinController = require("../controllers/petrinController");

router.post("/add", petrinController.addPetrin);

router.post("/add-picture/:slug", petrinController.addPicturesToPetrin);

router.get("/all", petrinController.getPetrins);

router.get("/:slug", petrinController.getPetrinBySlug);

router.put("/edit/:slug", petrinController.updatePetrin);

router.delete("/delete/:slug", petrinController.deletePetrin);

module.exports = router;
