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

test.serial(
  'insertWeeks > Returns the inserted weeks', async (t) => {
    t.plan(2);
    // Try to insert for many week in the database
    const weeks = [{ number: 1, name: "Week #1" }, { number: 2, name: "Week #2" }, { number: 3, name: "Week #3" }]
    const result = await weekModel.insertWeeks(weeks);
    //console.log(result)
    const expectedResult = [{ number: 1, name: "Week #1" }, { number: 2, name: "Week #2" }, { number: 3, name: "Week #3" }];

    t.is(result.length, expectedResult.length, "Must return same numbers of data")

    t.deepEqual(
      result,
      expectedResult,
      "Must return the inserted objects in an array"
    );
  }
)

test.serial("insertWeeks > Weeks are actually inserted in the database",
  async (t) => {
    t.plan(2);
    //  Inserting  weeks to the database for test
    const weeks = [{ number: 1, name: "Week #1" }, { number: 2, name: "Week #2" }, { number: 3, name: "Week #3" }]
    await weekModel.insertWeeks(weeks);

    // Fetching the weeks from database
    const dbQueryResults = await knex(weekModel.WEEK_TABLE_NAME).whereIn('number', [1, 2, 3])
    //console.log(dbQueryResults)
    t.is(weeks.length, dbQueryResults.length, "Must return same numbers of data");

    t.deepEqual(
      dbQueryResults,
      [{ number: 1, name: "Week #1" }, { number: 2, name: "Week #2" }, { number: 3, name: "Week #3" }],
      "Must return the inserted object from database"
    );
  }

)

test.serial(
  "insertWeeks > Throws when an existing week number is inserted again",
  async (t) => {
    t.plan(1);
    //  Inserting  weeks to the database for test
    const weeks = [{ number: 1, name: "Week #1" }, { number: 2, name: "Week #2" }, { number: 3, name: "Week #3" }]
    await weekModel.insertWeeks(weeks);
    // Trying to  insert the weeks again
    const weeks_data = [{ number: 1, name: "Week #1" }, { number: 2, name: "Week #2" }]
    await t.throwsAsync(
      () => weekModel.insertWeeks(weeks_data),
      { instanceOf: Error },
      "Must throw error if e the same weeks are inserted more than once"
    );
  }
);

test.serial("findAllWeeks > Returns all weeks in the database",
  async (t) => {
    t.plan(2);
    //  Inserting  weeks to the database for test
    const weeks = [{ number: 1, name: "Week #1" }, { number: 2, name: "Week #2" },
    { number: 3, name: "Week #3" }, { number: 4, name: "Week #4" }]
    await weekModel.insertWeeks(weeks);

    // Fetching the weeks from database

    const dbFindResults = await weekModel.findAllWeeks()
    //console.log(dbQueryResults)
    t.is(weeks.length, dbFindResults.length, "Must return same numbers of data");

    t.deepEqual(
      dbFindResults,
      weeks,
      "Must return all the data from database"
    );

  })

