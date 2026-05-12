const crypto = require("node:crypto");

const passwordAlgorithm = "scrypt";
const keyLength = 64;

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, keyLength).toString("hex");

  return `${passwordAlgorithm}:${salt}:${derivedKey}`;
}

function verifyPassword(password, storedHash) {
  const [algorithm, salt, expectedKey] = storedHash.split(":");

  if (algorithm !== passwordAlgorithm || !salt || !expectedKey) {
    return false;
  }

  const actualKey = crypto.scryptSync(password, salt, keyLength);
  const expectedBuffer = Buffer.from(expectedKey, "hex");

  if (actualKey.length !== expectedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(actualKey, expectedBuffer);
}

function createToken() {
  return crypto.randomBytes(32).toString("hex");
}

function createId(prefix) {
  return `${prefix}_${crypto.randomUUID()}`;
}

module.exports = {
  createId,
  createToken,
  hashPassword,
  verifyPassword,
};
