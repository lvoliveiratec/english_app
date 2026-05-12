const { MemoryStorage } = require("./memory");
const { PostgresStorage } = require("./postgres");

function createStorage() {
  if (process.env.DATABASE_URL) {
    return new PostgresStorage(process.env.DATABASE_URL);
  }

  return new MemoryStorage();
}

module.exports = {
  createStorage,
};
