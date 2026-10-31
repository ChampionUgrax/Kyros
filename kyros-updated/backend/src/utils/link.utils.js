const crypto = require("crypto");

const generateInviteCode = () => crypto.randomBytes(24).toString("base64url");

const hashValue = (value) =>
  crypto.createHash("sha256").update(value).digest("hex");

const createLinkDocumentId = (ownerUid, studentUid) =>
  hashValue(JSON.stringify([ownerUid, studentUid]));

module.exports = {
  generateInviteCode,
  hashValue,
  createLinkDocumentId,
};
