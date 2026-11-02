const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    equipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Equipment",
      required: true,
    },

    borrowerName: {
      type: String,
      required: true,
      trim: true,
    },

    borrowerId: {
      type: String,
      required: true,
      trim: true,
    },

    issueDate: {
      type: Date,
      default: Date.now,
    },

    expectedReturnDate: {
      type: Date,
      required: true,
    },

    actualReturnDate: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: ["ISSUED", "RETURNED"],
      default: "ISSUED",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Issue", issueSchema);
