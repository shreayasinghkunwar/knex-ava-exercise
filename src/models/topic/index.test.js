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

  t.true(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/.test(insertedItem.id)
    ,
    "Must generate an id of 36 characters in length in the standard format for UUID used by Postgres)"
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
    t.plan(4);
    //  inserting a topic to the database to test
    const instructor = await getInstructor("Bibek Aryal")
    const week = await insertWeek(1, "Week #1", instructor.id)

    await topicModel.insertForWeek(1, "HTML & CSS");
    const dbQueryResult = await knex(topicModel.TOPIC_TABLE_NAME).where(
      "week_number",
      1
    );

    t.is(dbQueryResult.length, 1, "Must return one item");

    const fetchData = dbQueryResult[0]
    t.true(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/.test(fetchData.id)
      ,
      "Must generate an id of 36 characters in length in the standard format for UUID used by Postgres)"
    );
    const expectedResult = { week_number: 1, name: "HTML & CSS" };

    t.is(
      fetchData.week_number,
      expectedResult.week_number,
      "Must have correct week number"
    );
    t.is(fetchData.name, expectedResult.name, "Must have correct name");
  }
);

test.serial(
  "insertForWeek > Throws when trying to insert a topic for a non existent week",
  async (t) => {


    await t.throwsAsync(
      async () => await topicModel.insertForWeek(1, "HTML & CSS"),
      { instanceOf: Error },
      "Must throw when trying to insert a topic for a non existent week"
    );


  }
);

test.serial("updateTopicById > Returns the updated topic", async (t) => {
  t.plan(1);
  //  inserting a topic to the database to test
  const instructor = await getInstructor("Ramesh KC")
  const week = await insertWeek(1, "Week #1", instructor.id)
  const inserted_topic = await topicModel.insertForWeek(1, "HTML & CSS");

  const updated_topic = await topicModel.updateTopicById(inserted_topic[0].id,
    { name: "HTML, CSS & JS" })
  const expectedResult = [{
    id: inserted_topic[0].id, name: "HTML, CSS & JS",
    week_number: 1
  }]

  t.deepEqual(updated_topic, expectedResult, "Must return updated topic")
});

test.serial("updateTopicById > Updates a topic", async (t) => {
  const instructor = await getInstructor("Ramesh KC")
  const week = await insertWeek(1, "Week #1", instructor.id)
  const inserted_topic = await topicModel.insertForWeek(1, "HTML & CSS");

  await topicModel.updateTopicById(inserted_topic[0].id,
    { name: "HTML, CSS & JS" });

  const updated_topic = await knex(topicModel.TOPIC_TABLE_NAME).where(
    'id',
    inserted_topic[0].id
  )
  t.deepEqual(updated_topic, [{
    id: inserted_topic[0].id,
    name: "HTML, CSS & JS",
    week_number: 1
  }], "Must return updated topic")

});

test.serial(

  "searchTopicWithWeekData > Returns topics matching the passed string", async (t) => {
    t.plan(2);
    const instructor = await getInstructor("Ramesh KC")
    const week = await insertWeek(1, "Week #1", instructor.id)
    const inserted_topic = await topicModel.insertForWeek(1, "HTML & CSS");
    const searchResult = await topicModel.searchTopicWithWeekData("HTML & CSS");
    console.log(searchResult);

    t.is(searchResult.length, 1, "Must return one item");

    t.deepEqual(searchResult, [{
      id: inserted_topic[0].id,
      name: 'HTML & CSS',
      week_number: 1,
      week_name: 'Week #1'
    }], "Must return topics matching the passed string ")


  }

);