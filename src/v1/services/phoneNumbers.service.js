const { PhoneNumber } = require("../models/phoneNumber.model");
const { telegramService } = require("../services");

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
      telegramService.sendMessage(
        "⚠️ ALERT:\nAll phone numbers have been called recently.\n\n@thewinper"
      );

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

module.exports = async (phoneNumbers = []) => {
  try {
    const normalize = (s) => String(s).trim();
    const isValid = (pn) => /^44\d{10}$/.test(pn);

    const normalized = phoneNumbers.map(normalize);
    const invalid = normalized.filter((n) => !isValid(n));
    const validUnique = [...new Set(normalized.filter(isValid))];

    if (validUnique.length === 0) {
      return {
        deleted: [],
        notFound: [],
        invalid,
        counts: {
          received: phoneNumbers.length,
          validUnique: 0,
          deleted: 0,
          notFound: 0,
          invalid: invalid.length,
        },
      };
    }

    // Find which of the valid numbers actually exist
    const existingDocs = await PhoneNumber.find(
      { number: { $in: validUnique } },
      { number: 1, _id: 0 }
    ).lean();

    const existingSet = new Set(existingDocs.map((d) => d.number));
    const toDelete = [...existingSet];

    if (toDelete.length) {
      await PhoneNumber.deleteMany({ number: { $in: toDelete } });
    }

    const notFound = validUnique.filter((n) => !existingSet.has(n));

    return {
      deleted: toDelete,
      notFound,
      invalid,
      counts: {
        received: phoneNumbers.length,
        validUnique: validUnique.length,
        deleted: toDelete.length,
        notFound: notFound.length,
        invalid: invalid.length,
      },
    };
  } catch (err) {
    throw err;
  }
};
