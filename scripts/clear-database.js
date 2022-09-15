const { knex } = require("../src/database");
const { TOPIC_TABLE_NAME } = require("../src/models/topic");
const { WEEK_TABLE_NAME } = require("../src/models/week");
const { INSTRUCTOR_TABLE_NAME } = require("../src/models/instructor")

async function clearTable(tableName) {
  process.stderr.write(`> Clearning table ${tableName}\n`);
  return knex(tableName).del();
}

async function main() {
  const tablesToClear = [TOPIC_TABLE_NAME, WEEK_TABLE_NAME, INSTRUCTOR_TABLE_NAME]; // Must be ordered such that foreign key dependencies don't get in the way of deletion
  for (const tableToClear of tablesToClear) {
    await clearTable(tableToClear);
  }
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e.message);
    process.exit(1);
  });
