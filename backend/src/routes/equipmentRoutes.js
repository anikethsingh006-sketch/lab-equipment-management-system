const express = require("express");

const {
  createEquipment,
  getAllEquipment,
  getEquipmentById,
  updateEquipment,
  deleteEquipment,
} = require("../controllers/equipmentController");

const router = express.Router();

router.route("/").get(getAllEquipment).post(createEquipment);

router
  .route("/:id")
  .get(getEquipmentById)
  .patch(updateEquipment)
  .delete(deleteEquipment);

module.exports = router;
