const express = require("express");

const {
  createMaintenance,
  getAllMaintenance,
  updateMaintenance,
} = require("../controllers/maintenanceController");

const router = express.Router();

router.route("/").get(getAllMaintenance).post(createMaintenance);

router.patch("/:id", updateMaintenance);

module.exports = router;
