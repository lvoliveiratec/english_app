const fs = require("node:fs/promises");
const path = require("node:path");
const { Pool } = require("pg");

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required to run migrations.");
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const schemaPath = path.join(__dirname, "..", "db", "schema.sql");
  const schema = await fs.readFile(schemaPath, "utf8");

  try {
    await pool.query(schema);
    console.log("Database migrations applied.");
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
