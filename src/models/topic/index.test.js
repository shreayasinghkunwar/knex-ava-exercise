const test = require("ava");
const { knex } = require("../../database");
const topicModel = require(".");
const weekModel = require("../week");

const instructorModel = require("../instructor");

test.beforeEach(async () => {
  // Clear the weeks and topics tables before each test so we don't have to worry about reinserting the same id
  // We have to clear the week table because topic depends on week
  await knex(topicModel.TOPIC_TABLE_NAME).del();
  await knex(weekModel.WEEK_TABLE_NAME).del();
  await knex(instructorModel.INSTRUCTOR_TABLE_NAME).del();

  //inserting instructors
  await (instructorModel.insertInstructors([{ name: "Ramesh KC", post: "Software Engineer I" },
  { name: "Bibek Aryal", post: "Software Associate" }]))


});

async function getInstructor(name) {
  const instructor = await knex(instructorModel.INSTRUCTOR_TABLE_NAME).where(
    "name",
    name
  )
  return instructor[0];
}

async function insertWeek(num, w_name, instructorId) {
  const inserted_wk = await weekModel.insertWeek(num, w_name, instructorId)
  return inserted_wk[0];

}


test.serial("insertForWeek > Returns the inserted topic", async (t) => {
  t.plan(4);
  // We setup the test by inserting a topic to the database

  const instructor = await getInstructor("Bibek Aryal")

  const week = await insertWeek(1, "Week #1", instructor.id)

  const result = await topicModel.insertForWeek(week.number, "HTML & CSS");
  t.is(result.length, 1, "Must return one item");

  const insertedItem = result[0];
  t.true(
    insertedItem.id && insertedItem.id.length === 36,
    "Must generate an id of 36 characters in length (which is the standard for UUID used by Postgres)"
  );

  const expectedResult = { week_number: 1, name: "HTML & CSS" };
  t.is(
    insertedItem.week_number,
    expectedResult.week_number,
    "Must have correct week number"
  );

  t.is(insertedItem.name, expectedResult.name, "Must have correct name");
});

