const { MAX_FILE_UPLOAD_SIZE } = require("../../system/server");

module.exports = Object.freeze({
  internal: {
    en: "An unexpected error happened on the server",
    ar: "حصل خطأ غير متوقع في الخادم",
  },
  unsupportedRoute: {
    en: "The link is not supported",
    ar: "الرابط غير مدعوم",
  },
  invalidMongoId: {
    en: "Invalid ID",
    ar: "كود التعريف غير صالح",
  },
  noMongoId: {
    en: "You should add the ID",
    ar: "يجب عليك إضافة المعرّف",
  },
  largeFile: {
    en: `Maximum file upload size is ${MAX_FILE_UPLOAD_SIZE.toLocaleString()}MB`,
    ar: `الحد الأقصى لحجم ملف الرفع هو ${MAX_FILE_UPLOAD_SIZE.toLocaleString()} ميغا بايت`,
  },
  tempBlocked: {
    en: "Your device has been temporarily blocked",
    ar: "تم حظر جهازك مؤقتًا",
  },
});
