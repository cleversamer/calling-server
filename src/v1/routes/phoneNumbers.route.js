const router = require("express").Router();
const { phoneNumbersController } = require("../controllers");

router.post("/addList", phoneNumbersController.addPhoneNumbers);

router.get(
  "/getAvailableNumber",
  phoneNumbersController.getAvailablePhoneNumber
);

module.exports = router;
