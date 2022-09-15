const { knex } = require("../../database");

const WEEK_TABLE_NAME = "weeks";

function getTableQueryBuilder() {
  return knex(WEEK_TABLE_NAME);
}

function insertWeek(number, name, instructor_id) {
  return getTableQueryBuilder().insert({ number, name, instructor_id }).returning("*");
}

/**
 * @param {{ number: number, name: string }[]} weeks
 */
function insertWeeks(weeks) {
  return getTableQueryBuilder().insert(weeks).returning("*");
}

function findAllWeeks() {
  return getTableQueryBuilder().select(`${WEEK_TABLE_NAME}.*`);
}

module.exports = {
  insertWeek,
  findAllWeeks,
  insertWeeks,
  WEEK_TABLE_NAME,
};
