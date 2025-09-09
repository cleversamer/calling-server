module.exports.PORT = process.env["PORT"] || 4000;

module.exports.DATABASE_NAME = "winper-calling-bot";

module.exports.DATABASE_URI =
  process.env["MONGODB_URI"] ||
  `mongodb://127.0.0.1:27017/${this.DATABASE_NAME}`;

module.exports.MAX_FILE_UPLOAD_SIZE = 1; // In MegaBytes

module.exports.MAX_REQ_BODY_SIZE = 1024 * 100; // In KiloBytes

module.exports.MAX_REQUESTS = {
  NUMBER: 8, // 8 requests allowed
  PER_MILLISECONDS: 60 * 1000, //  => per 1 minute
};
