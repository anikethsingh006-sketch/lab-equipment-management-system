const Equipment = require("../models/Equipment");

// GET EQUIPMENT ANALYTICS
const getEquipmentAnalytics = async (req, res, next) => {
  try {
    const [categoryStats, locationStats, conditionStats] = await Promise.all([
      Equipment.aggregate([
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
      ]),

      Equipment.aggregate([
        {
          $group: {
            _id: "$location",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
      ]),

      Equipment.aggregate([
        {
          $group: {
            _id: "$condition",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
      ]),
    ]);

    res.status(200).json({
      success: true,
      data: {
        categoryStats,
        locationStats,
        conditionStats,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEquipmentAnalytics,
};
