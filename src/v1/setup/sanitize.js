const express = require("express");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const cors = require("cors");
const upload = require("express-fileupload");
const helmet = require("helmet");
const { uploadLimitHandler } = require("../middleware/apiError");
const { server } = require("../config/system");

const uploader = upload({
  limits: { fileSize: server.MAX_FILE_UPLOAD_SIZE * 1024 * 1024 },
  abortOnLimit: true,
  uploadLimitHandler,
});

module.exports = (app) => {
  app.use(uploader);
  app.use(express.json({ limit: `${server.MAX_REQ_BODY_SIZE}kb` }));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static("uploads"));
  app.use(helmet());
  app.use(cors({ origin: true }));
  app.use(xss());
  app.use(mongoSanitize());
};
