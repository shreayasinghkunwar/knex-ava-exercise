const test = require("ava");
const { knex } = require("../../database");
const topicModel = require(".");
const weekModel = require("../week");

test.beforeEach(async () => {
  // Clear the weeks and topics tables before each test so we don't have to worry about reinserting the same id
  // We have to clear the week table because topic depends on week
  await knex(topicModel.TOPIC_TABLE_NAME).del();
  await knex(weekModel.WEEK_TABLE_NAME).del();

});

test.serial("insertForWeek > Returns the inserted topic", async (t) => {
  t.plan(4);
  // We setup the test by inserting a topic to the database
  await knex(weekModel.WEEK_TABLE_NAME).insert({ number: 1, name: "Week #1" });
  const result = await topicModel.insertForWeek(1, "HTML & CSS");
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

test.serial(
  "insertForWeek > Topics are actually inserted in the database",
  async (t) => {
    t.plan(3);
    //  inserting a topic to the database to test

    await knex(weekModel.WEEK_TABLE_NAME).insert({ number: 1, name: "Week #1" });
    await topicModel.insertForWeek(1, "HTML & CSS");
    const dbQueryResult = await knex(topicModel.TOPIC_TABLE_NAME).where(
      "week_number",
      1
    );

    t.is(dbQueryResult.length, 1, "Must return one item");

    const fetchData = dbQueryResult[0]
    const expectedResult = { week_number: 1, name: "HTML & CSS" };

    t.is(
      fetchData.week_number,
      expectedResult.week_number,
      "Must have correct week number"
    );
    t.is(fetchData.name, expectedResult.name, "Must have correct name");
  }
);


/*
test.todo("insertForWeek > Returns the inserted weeks");
test.todo("insertForWeek > Topics are actually inserted in the database");
test.todo(
  "insertForWeek > Throws when trying to insert a topic for a non existent week"
);
test.todo("updateTopicById > Returns the updated topic");
test.todo("updateTopicById > Updates a topic");
test.todo(
  "searchTopicWithWeekData > Returns topics matching the passed string"
);
test.todo(
  "searchTopicWithWeekData > Returns empty array if no topics match the query"
);
test.todo(
  "deleteTopicById > Deletes the topic whose id is passed as an argument"
);
test.todo("deleteTopicById > Does not throw when deleting non-existent topic");
*/