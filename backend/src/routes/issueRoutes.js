const express = require("express");

const {
  issueEquipment,
  returnEquipment,
  getIssues,
  getActiveIssues,
} = require("../controllers/issueController");

const router = express.Router();

router.get("/", getIssues);
router.get("/active", getActiveIssues);

router.post("/issue", issueEquipment);
router.patch("/:issueId/return", returnEquipment);

module.exports = router;
