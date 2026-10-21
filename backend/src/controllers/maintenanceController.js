const Maintenance = require("../models/Maintenance");
const Equipment = require("../models/Equipment");

// CREATE MAINTENANCE REPORT
const createMaintenance = async (req, res, next) => {
  try {
    const { equipmentId, description, priority } = req.body;

    if (!equipmentId || !description) {
      return res.status(400).json({
        success: false,
        message: "Equipment ID and description are required",
      });
    }

    const equipment = await Equipment.findById(equipmentId);

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: "Equipment not found",
      });
    }

    if (equipment.status === "RETIRED") {
      return res.status(409).json({
        success: false,
        message: "Cannot create maintenance for retired equipment",
      });
    }

    const maintenance = await Maintenance.create({
      equipment: equipmentId,
      description,
      priority,
    });

    if (equipment.status !== "BORROWED") {
      equipment.status = "MAINTENANCE";
      await equipment.save();
    }

    res.status(201).json({
      success: true,
      message: "Maintenance report created",
      data: maintenance,
    });
  } catch (error) {
    next(error);
  }
};

// GET ALL MAINTENANCE REPORTS
const getAllMaintenance = async (req, res, next) => {
  try {
    const maintenance = await Maintenance.find()
      .populate("equipment", "name serialNumber location")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: maintenance.length,
      data: maintenance,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE MAINTENANCE STATUS
const updateMaintenance = async (req, res, next) => {
  try {
    const { status } = req.body;

    const allowedStatuses = ["OPEN", "IN_PROGRESS", "RESOLVED"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid maintenance status",
      });
    }

    const maintenance = await Maintenance.findById(req.params.id);

    if (!maintenance) {
      return res.status(404).json({
        success: false,
        message: "Maintenance report not found",
      });
    }

    maintenance.status = status;

    if (status === "RESOLVED") {
      maintenance.resolvedAt = new Date();
    } else {
      maintenance.resolvedAt = null;
    }

    await maintenance.save();

    if (status === "RESOLVED") {
      const otherOpenReports = await Maintenance.exists({
        equipment: maintenance.equipment,
        _id: { $ne: maintenance._id },
        status: { $in: ["OPEN", "IN_PROGRESS"] },
      });

      if (!otherOpenReports) {
        await Equipment.findOneAndUpdate(
          {
            _id: maintenance.equipment,
            status: "MAINTENANCE",
          },
          {
            $set: { status: "AVAILABLE" },
          },
        );
      }
    }

    res.status(200).json({
      success: true,
      message: "Maintenance report updated",
      data: maintenance,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createMaintenance,
  getAllMaintenance,
  updateMaintenance,
};
