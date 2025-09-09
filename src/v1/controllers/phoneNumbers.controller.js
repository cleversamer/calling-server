const { phoneNumbersService } = require("../services");
const { clientSchema, PhoneNumber } = require("../models/phoneNumber.model");
const httpStatus = require("http-status");
const _ = require("lodash");

module.exports.addPhoneNumbers = async (req, res, next) => {
  try {
    const { phoneNumbers = [] } = req.body;

    // Split into valid/invalid & dedupe valid ones
    const isValid = (pn) => /^44\d{10}$/.test(pn);
    const invalid = phoneNumbers.filter((pn) => !isValid(pn));
    const validUnique = Array.from(new Set(phoneNumbers.filter(isValid)));

    if (validUnique.length === 0) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "error",
        success: false,
        message: "No valid phone numbers provided. Format must be 44XXXXXXXXXX",
        data: { invalid },
      });
    }

    // Find which of the valid numbers are already in the DB (to avoid E11000)
    const existingDocs = await PhoneNumber.find(
      { number: { $in: validUnique } },
      { number: 1 }
    ).lean();

    const existingSet = new Set(existingDocs.map((d) => d.number));
    const toInsert = validUnique.filter((n) => !existingSet.has(n));

    // Insert only the new ones
    const addedDocs = toInsert.length
      ? await phoneNumbersService.addPhoneNumbers(toInsert)
      : [];

    return res.status(httpStatus.CREATED).json({
      status: "success",
      success: true,
      counts: {
        received: phoneNumbers.length,
        validUnique: validUnique.length,
        added: addedDocs.length,
        skippedExisting: existingSet.size,
        invalid: invalid.length,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports.getAvailablePhoneNumber = async (req, res, next) => {
  try {
    const phoneNumber = await phoneNumbersService.getAvailablePhoneNumber();

    if (!phoneNumber) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "error",
        success: false,
        data: null,
        message: "No available phone numbers",
      });
    }

    res.status(httpStatus.OK).json({
      status: "success",
      success: true,
      data: phoneNumber ? _.pick(phoneNumber, clientSchema) : null,
    });
  } catch (err) {
    next(err);
  }
};
