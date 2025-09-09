const { check, validationResult } = require("express-validator");
const httpStatus = require("http-status");
const { ApiError } = require("../apiError");
const errors = require("../../config/errors");

module.exports.putQueryParamsInBody = (req, res, next) => {
  req.body = {
    ...req.query,
    ...req.params,
    ...req.body,
  };

  next();
};

module.exports.parseTokenFromQuery = (req, res, next) => {
  req.headers["Authorization"] = "Bearer " + req.query["token"];
  next();
};

module.exports.next = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const statusCode = httpStatus.BAD_REQUEST;
    const message = errors.array()[0].msg;
    const err = new ApiError(statusCode, message);
    return next(err);
  }

  next();
};

module.exports.conditionalCheck = (key, checker) => (req, res, next) =>
  req.body[key] ? checker(req, res, next) : next();

module.exports.checkPage = (req, res, next) => {
  try {
    const { page } = req.body;

    // Check if page exist
    if (!page) {
      const statusCode = httpStatus.BAD_REQUEST;
      const message = errors.system.pageNumberRequired;
      throw new ApiError(statusCode, message);
    }

    // Check if page is a numeric value
    const number = parseInt(page);
    const isNumber = Number.isInteger(number);
    if (!isNumber) {
      const statusCode = httpStatus.BAD_REQUEST;
      const message = errors.system.pageNumberRequired;
      throw new ApiError(statusCode, message);
    }

    // Check if page number is positive
    if (number < 1) {
      const statusCode = httpStatus.BAD_REQUEST;
      const message = errors.system.invalidPageNumber;
      throw new ApiError(statusCode, message);
    }

    next();
  } catch (err) {
    next(err);
  }
};

module.exports.checkLimit = (req, res, next) => {
  try {
    const { limit } = req.body;

    // Check if limit exist
    if (!limit) {
      const statusCode = httpStatus.BAD_REQUEST;
      const message = errors.system.limitNumberRequired;
      throw new ApiError(statusCode, message);
    }

    // Check if limit is a numeric value
    const number = parseInt(limit);
    const isNumber = Number.isInteger(number);
    if (!isNumber) {
      const statusCode = httpStatus.BAD_REQUEST;
      const message = errors.system.limitNumberRequired;
      throw new ApiError(statusCode, message);
    }

    // Check if limit number is positive
    if (number < 1) {
      const statusCode = httpStatus.BAD_REQUEST;
      const message = errors.system.invalidLimitNumber;
      throw new ApiError(statusCode, message);
    }

    next();
  } catch (err) {
    next(err);
  }
};

module.exports.checkErrorId = check("errorId")
  .isMongoId()
  .withMessage(errors.serverError.invalidId);
