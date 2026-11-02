const express = require("express");

const { getEquipmentAnalytics } = require("../controllers/reportController");

const router = express.Router();

router.get("/equipment", getEquipmentAnalytics);

module.exports = router;
