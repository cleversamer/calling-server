const { PhoneNumber } = require("../models/phoneNumber.model");

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

module.exports.getAvailablePhoneNumber = async () => {
  try {
    const cutoff = new Date(Date.now() - 13 * 60 * 1000); // 13 minutes ago

    const phoneNumber = await PhoneNumber.findOneAndUpdate(
      {
        $or: [
          { lastCalled: null }, // never called
          { lastCalled: { $lte: cutoff } }, // last call was >13 mins ago
        ],
      },
      {
        $inc: { callCount: 1 },
        lastCalled: new Date(),
      },
      { sort: { lastCalled: 1 }, new: true }
    );

    return phoneNumber;
  } catch (err) {
    throw err;
  }
};
