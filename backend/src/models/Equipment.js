const mongoose = require("mongoose");

const equipmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Equipment name is required"],
      trim: true,
      maxlength: 100,
    },

    category: {
      type: String,
      required: [true, "Equipment category is required"],
      trim: true,
    },

    serialNumber: {
      type: String,
      required: [true, "Serial number is required"],
      unique: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    location: {
      type: String,
      required: [true, "Equipment location is required"],
      trim: true,
    },

    status: {
      type: String,
      enum: ["AVAILABLE", "BORROWED", "MAINTENANCE", "RETIRED"],
      default: "AVAILABLE",
    },

    purchaseDate: {
      type: Date,
      default: null,
    },

    condition: {
      type: String,
      enum: ["EXCELLENT", "GOOD", "FAIR", "DAMAGED"],
      default: "GOOD",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Equipment", equipmentSchema);
