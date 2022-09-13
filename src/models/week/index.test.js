const test = require("ava");
const { knex } = require("../../database");
const weekModel = require(".");

test.beforeEach(async () => {
  // Clear the weeks table before each test so we don't have to worry about reinserting the same id
  await knex(weekModel.WEEK_TABLE_NAME).del();
});

// We use test.serial so that tests are run one after another and we dont run into problems with duplicate primary key insertion
// The default behavior of ava is to run tests parallelly.
test.serial("insertWeek > Returns the inserted week", async (t) => {
  t.plan(1);
  // Try to insert a week in the database
  const result = await weekModel.insertWeek(1, "Week #1");
  const expectedResult = [{ number: 1, name: "Week #1" }];
  t.deepEqual(
    result,
    expectedResult,
    "Must return the inserted object in an array"
  );
});

test.serial(
  "insertWeek > Week is actually inserted in the database",
  async (t) => {
    t.plan(1);
    await weekModel.insertWeek(1, "Week #1");
    // We write a query here instead of using a method inside weekModel
    // because using something inside weekModel would defeat the purpose of testing weekModel
    const dbQueryResult = await knex(weekModel.WEEK_TABLE_NAME).where(
      "number",
      1
    );
    t.deepEqual(
      dbQueryResult,
      [{ number: 1, name: "Week #1" }],
      "Must return the inserted object from database"
    );
  }
);

test.serial(
  "insertWeek > Throws when an existing week number is inserted again",
  async (t) => {
    t.plan(1);
    // We setup the test by inserting a week to the database
    await weekModel.insertWeek(2, "Week #2");
    // We try to insert the week again
    await t.throwsAsync(
      () => weekModel.insertWeek(2, "Week #2"),
      { instanceOf: Error },
      "Must throw if the same week is inserted more than once"
    );
  }
);

test.todo("insertWeeks > Returns the inserted weeks");
test.todo("insertWeeks > Weeks are actually inserted in the database");
test.todo(
  "insertWeeks > Throws when an existing week number is inserted again"
);
test.todo("findAllWeeks > Returns all weeks in the database");
