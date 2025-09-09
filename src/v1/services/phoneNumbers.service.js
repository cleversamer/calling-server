const { PhoneNumber } = require("../models/phoneNumber.model");
// const { telegramService } = require("../services");

module.exports.addPhoneNumbers = async (phoneNumbers) => {
  try {
    const phoneNumberInstances = phoneNumbers.map((phoneNumber) => {
      return new PhoneNumber({
        number: phoneNumber,
        lastCalled: null,
        callCount: 0,
      });
    });

    await PhoneNumber.insertMany(phoneNumberInstances);

    return phoneNumberInstances;
  } catch (err) {
    throw err;
  }
};

module.exports.fetchAvailablePhoneNumber = async () => {
  try {
    const now = new Date();
    const cutoff = new Date(Date.now() - 13 * 60 * 1000); // 13 minutes ago
    const updates = { $inc: { callCount: 1 }, lastCalled: now };

    // 1) Highest priority: numbers never called
    let phoneNumber = await PhoneNumber.findOneAndUpdate(
      { lastCalled: null },
      updates,
      { sort: { createdAt: 1 }, new: true, upsert: false }
    );

    // 2) Fallback: numbers whose lastCalled <= cutoff
    if (!phoneNumber) {
      // await telegramService.sendMessage(
      //   "⚠️ ALERT:\nAll phone numbers have been called recently.\n\n@thewinper"
      // );

      phoneNumber = await PhoneNumber.findOneAndUpdate(
        { lastCalled: { $lte: cutoff } },
        updates,
        { sort: { lastCalled: 1 }, new: true, upsert: false }
      );
    }

    return phoneNumber; // may be null if none available
  } catch (err) {
    throw err;
  }
};
