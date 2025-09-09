const { phoneNumbersService } = require("../services");
const { clientSchema } = require("../models/phoneNumber.model");
const httpStatus = require("http-status");
const _ = require("lodash");

module.exports.addPhoneNumbers = async (req, res, next) => {
  try {
    const { phoneNumbers = [] } = req.body;

    // filter valid phone numbers
    const validPhoneNumbers = phoneNumbers.filter((pn) =>
      /^44\d{10}$/.test(pn)
    );

    if (validPhoneNumbers.length === 0) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "error",
        success: false,
        message: "No valid phone numbers provided. Format must be 44XXXXXXXXXX",
      });
    }

    const addedPhoneNumbers = await phoneNumbersService.addPhoneNumbers(
      validPhoneNumbers
    );

    res.status(httpStatus.CREATED).json({
      status: "success",
      success: true,
      data: addedPhoneNumbers.map((pn) => _.pick(pn, clientSchema)),
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
