const { Schema, model } = require("mongoose");

const clientSchema = ["_id", "number", "lastCalled", "callCount"];

const phoneNumberSchema = new Schema(
  {
    number: {
      type: String,
      required: true,
      trim: true,
      minlength: 12,
      maxlength: 12,
      unique: true,
    },
    lastCalled: {
      type: Date,
      default: null,
    },
    callCount: {
      type: Number,
      default: 0,
    },
  },
  {
    minimize: false,
    timestamps: true,
  }
);

const PhoneNumber = model("PhoneNumber", phoneNumberSchema);

module.exports = {
  PhoneNumber,
  clientSchema,
};
