const Equipment = require("../models/Equipment");

// CREATE EQUIPMENT
const createEquipment = async (req, res, next) => {
  try {
    const {
      name,
      category,
      serialNumber,
      description,
      location,
      status,
      purchaseDate,
      condition,
    } = req.body;

    const equipment = await Equipment.create({
      name,
      category,
      serialNumber,
      description,
      location,
      status,
      purchaseDate,
      condition,
    });

    res.status(201).json({
      success: true,
      message: "Equipment created successfully",
      data: equipment,
    });
  } catch (error) {
    next(error);
  }
};

// GET ALL EQUIPMENT
const getAllEquipment = async (req, res, next) => {
  try {
    const { category, status, search } = req.query;

    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (status) {
      filter.status = status;
    }

    if (search) {
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      filter.name = {
        $regex: escapedSearch,
        $options: "i",
      };
    }

    const equipment = await Equipment.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: equipment.length,
      data: equipment,
    });
  } catch (error) {
    next(error);
  }
};

// GET EQUIPMENT BY ID
const getEquipmentById = async (req, res, next) => {
  try {
    const equipment = await Equipment.findById(req.params.id);

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: "Equipment not found",
      });
    }

    res.status(200).json({
      success: true,
      data: equipment,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE EQUIPMENT
const updateEquipment = async (req, res, next) => {
  try {
    const allowedFields = [
      "name",
      "category",
      "serialNumber",
      "description",
      "location",
      "status",
      "purchaseDate",
      "condition",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const equipment = await Equipment.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: "Equipment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Equipment updated successfully",
      data: equipment,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE EQUIPMENT
const deleteEquipment = async (req, res, next) => {
  try {
    const equipment = await Equipment.findById(req.params.id);

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: "Equipment not found",
      });
    }

    if (equipment.status === "BORROWED") {
      return res.status(409).json({
        success: false,
        message: "Cannot delete equipment that is currently borrowed",
      });
    }

    await equipment.deleteOne();

    res.status(200).json({
      success: true,
      message: "Equipment deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEquipment,
  getAllEquipment,
  getEquipmentById,
  updateEquipment,
  deleteEquipment,
};
