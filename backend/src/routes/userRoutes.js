const express = require("express");

const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserStatus,
} = require("../controllers/userController");

const router = express.Router();

router.route("/").get(getAllUsers).post(createUser);

router.route("/:id").get(getUserById).put(updateUser);

router.patch("/:id/status", updateUserStatus);

module.exports = router;
