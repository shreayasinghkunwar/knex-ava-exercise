const test = require("ava");
const { knex } = require("../../database");
const weekModel = require(".");
const instructorModel = require("../instructor");

test.beforeEach(async () => {
  // Clear the weeks table before each test so we don't have to worry about reinserting the same id
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
  );
  return instructor[0];

}
async function setTestData() {

  const instructor1 = await getInstructor("Bibek Aryal")
  const instructor2 = await getInstructor("Ramesh KC");
  const weeks = [{ number: 1, name: "Week #1", instructor_id: instructor1.id },
  { number: 2, name: "Week #2", instructor_id: instructor1.id },
  { number: 3, name: "Week #3", instructor_id: instructor2.id }]
  return weekModel.insertWeeks(weeks);
}


test.serial("insertWeek > Returns the inserted week", async (t) => {
  t.plan(1);

  const instructor = await getInstructor("Bibek Aryal")
  const result = await weekModel.insertWeek(1, "Week #1", instructor.id);
  const expectedResult = [{ number: 1, name: "Week #1", instructor_id: instructor.id }];

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
    const instructor = await getInstructor("Ramesh KC");
    await weekModel.insertWeek(1, "Week #1", instructor.id);
    const dbQueryResult = await knex(weekModel.WEEK_TABLE_NAME).where(
      "number",
      1
    );

    t.deepEqual(
      dbQueryResult,
      [{ number: 1, name: "Week #1", instructor_id: instructor.id }],
      "Must return the inserted object from database"
    );
  }
);


test.serial(
  "insertWeek > Throws when an existing week number is inserted again",
  async (t) => {
    t.plan(1);
    // We setup the test by inserting a week to the database
    const instructor = await getInstructor("Bibek Aryal")
    await weekModel.insertWeek(2, "Week #2", instructor.id);
    // We try to insert the week again
    await t.throwsAsync(
      () => weekModel.insertWeek(2, "Week #2", instructor.id),
      { instanceOf: Error },
      "Must throw if the same week is inserted more than once"
    );
  }
);

test.serial(
  'insertWeeks > Returns the inserted weeks', async (t) => {
    t.plan(2);
    // Try to insert for many week in the database
    const result = await setTestData();
    const instructor1 = await getInstructor("Bibek Aryal");
    const instructor2 = await getInstructor("Ramesh KC");
    const expectedResult = [{ number: 1, name: "Week #1", instructor_id: instructor1.id },
    { number: 2, name: "Week #2", instructor_id: instructor1.id },
    { number: 3, name: "Week #3", instructor_id: instructor2.id }];

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
    await setTestData();
    const instructor1 = await getInstructor("Bibek Aryal");
    const instructor2 = await getInstructor("Ramesh KC");
    // Fetching the weeks from database
    const dbQueryResults = await knex(weekModel.WEEK_TABLE_NAME).whereIn
      ('number', [1, 2, 3])
    //console.log(dbQueryResults)
    t.is(3, dbQueryResults.length, "Must return same numbers of data");

    t.deepEqual(
      dbQueryResults,
      [{ number: 1, name: "Week #1", instructor_id: instructor1.id },
      { number: 2, name: "Week #2", instructor_id: instructor1.id },
      { number: 3, name: "Week #3", instructor_id: instructor2.id }],
      "Must return the inserted object from database"
    );
  }

)

test.serial(
  "insertWeeks > Throws when an existing week number is inserted again",
  async (t) => {
    t.plan(1);
    //  Inserting  weeks to the database for test
    await setTestData();
    // Trying to  insert the weeks again
    await t.throwsAsync(
      async () => await setTestData(),
      { instanceOf: Error },
      "Must throw error if e the same weeks are inserted more than once"
    );
  }
);

test.serial("findAllWeeks > Returns all weeks in the database",
  async (t) => {
    t.plan(1);
    //  Inserting  weeks to the database for test

    await setTestData();

    // Fetching the weeks from database
    const dbFindResults = await weekModel.findAllWeeks()
    //console.log(dbQueryResults)
    const instructor1 = await getInstructor("Bibek Aryal");
    const instructor2 = await getInstructor("Ramesh KC");

    t.deepEqual(
      dbFindResults,
      [{ number: 1, name: "Week #1", instructor_id: instructor1.id },
      { number: 2, name: "Week #2", instructor_id: instructor1.id },
      { number: 3, name: "Week #3", instructor_id: instructor2.id }],
      "Must return all the data from database"
    );

  })

