const mongoose = require("mongoose");
const Equipment = require("../models/Equipment");
const Issue = require("../models/Issue");

// ==========================================
// ISSUE EQUIPMENT
// ==========================================
const issueEquipment = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    const { equipmentId, borrowerName, borrowerId, expectedReturnDate } =
      req.body;

    // Validate required fields
    if (!equipmentId || !borrowerName || !borrowerId || !expectedReturnDate) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Validate MongoDB ObjectId
    if (!mongoose.isValidObjectId(equipmentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid equipment ID",
      });
    }

    // Validate expected return date
    const returnDate = new Date(expectedReturnDate);

    if (Number.isNaN(returnDate.getTime()) || returnDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Expected return date must be in the future",
      });
    }

    let newIssue;

    // Perform both database operations atomically
    await session.withTransaction(async () => {
      // Find equipment and update status only if AVAILABLE
      const equipment = await Equipment.findOneAndUpdate(
        {
          _id: equipmentId,
          status: "AVAILABLE",
        },
        {
          $set: {
            status: "BORROWED",
          },
        },
        {
          new: true,
          session,
        },
      );

      if (!equipment) {
        const error = new Error("Equipment not found or is not available");
        error.statusCode = 409;
        throw error;
      }

      // Create issue transaction
      const createdIssues = await Issue.create(
        [
          {
            equipment: equipment._id,
            borrowerName: borrowerName.trim(),
            borrowerId: borrowerId.trim(),
            expectedReturnDate: returnDate,
          },
        ],
        { session },
      );

      newIssue = createdIssues[0];
    });

    return res.status(201).json({
      success: true,
      message: "Equipment issued successfully",
      data: newIssue,
    });
  } catch (error) {
    next(error);
  } finally {
    await session.endSession();
  }
};

// ==========================================
// RETURN EQUIPMENT
// ==========================================
const returnEquipment = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    const { issueId } = req.params;

    // Validate issue ID
    if (!mongoose.isValidObjectId(issueId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid issue ID",
      });
    }

    let returnedIssue;

    await session.withTransaction(async () => {
      // Find active issue and mark it returned
      const issue = await Issue.findOneAndUpdate(
        {
          _id: issueId,
          status: "ISSUED",
        },
        {
          $set: {
            status: "RETURNED",
            actualReturnDate: new Date(),
          },
        },
        {
          new: true,
          session,
        },
      );

      if (!issue) {
        const error = new Error(
          "Issue record not found or equipment already returned",
        );
        error.statusCode = 404;
        throw error;
      }

      // Update equipment status
      const equipment = await Equipment.findOneAndUpdate(
        {
          _id: issue.equipment,
          status: "BORROWED",
        },
        {
          $set: {
            status: "AVAILABLE",
          },
        },
        {
          new: true,
          session,
        },
      );

      if (!equipment) {
        const error = new Error("Equipment status is inconsistent");
        error.statusCode = 409;
        throw error;
      }

      returnedIssue = issue;
    });

    return res.status(200).json({
      success: true,
      message: "Equipment returned successfully",
      data: returnedIssue,
    });
  } catch (error) {
    next(error);
  } finally {
    await session.endSession();
  }
};

// ==========================================
// GET ALL ISSUE TRANSACTIONS
// ==========================================
const getIssues = async (req, res, next) => {
  try {
    const issues = await Issue.find()
      .populate("equipment", "name serialNumber category location status")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: issues.length,
      data: issues,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// GET ACTIVE ISSUES
// ==========================================
const getActiveIssues = async (req, res, next) => {
  try {
    const issues = await Issue.find({
      status: "ISSUED",
    })
      .populate("equipment", "name serialNumber category location status")
      .sort({ issueDate: -1 });

    return res.status(200).json({
      success: true,
      count: issues.length,
      data: issues,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// EXPORT CONTROLLERS
// ==========================================
module.exports = {
  issueEquipment,
  returnEquipment,
  getIssues,
  getActiveIssues,
};
