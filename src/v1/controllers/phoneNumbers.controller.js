const { phoneNumbersService } = require("../services");
const { clientSchema } = require("../models/phoneNumber.model");
const httpStatus = require("http-status");
const _ = require("lodash");

module.exports.addPhoneNumbers = async (req, res, next) => {
  try {
    const { phoneNumbers = [] } = req.body;

    const addedPhoneNumbers = await phoneNumbersService.addPhoneNumbers(
      phoneNumbers
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
    res.status(httpStatus.OK).json({
      status: "success",
      success: true,
      data: phoneNumber ? _.pick(phoneNumber, clientSchema) : null,
    });
  } catch (err) {
    next(err);
  }
};
