const test = require("ava");
const { knex } = require("../../database");
const instructorModel = require(".");
const topicModel = require("../topic");
const weekModel = require("../week")


test.beforeEach(async () => {
    // Clearing the instructor table before each test 
    await knex(topicModel.TOPIC_TABLE_NAME).del();
    await knex(weekModel.WEEK_TABLE_NAME).del();
    await knex(instructorModel.INSTRUCTOR_TABLE_NAME).del();
});

function setupTestData() {
    return instructorModel.insertInstructors([{ name: "Ram Rai", post: "Senior Engineer" },
    { name: "Hari lama", post: "Senior Engineer I" }, { name: "Hasina Ray", post: "Associate Engineer I" }
    ]);

}

test.serial("insertInstructor > Returns the inserted instructor", async (t) => {
    t.plan(3);
    // Try to insert a week in the database
    const result = await instructorModel.insertInstructor("Ram Rai", "Senior Engineer");
    const expectedResult = { name: "Ram Rai", post: "Senior Engineer" };
    const obtainedResult = result[0];


    t.true(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/.test(obtainedResult.id)
        ,
        "Must generate an id of 36 characters in length in the standard format for UUID used by Postgres)"
    );


    t.is(
        obtainedResult.name,
        expectedResult.name,
        "Must return the correct name"
    );
    t.is(
        obtainedResult.post,
        expectedResult.post,
        "Must return the correct post"
    );
});


test.serial(
    "insertInstructors > Instructor is actually inserted in the database",
    async (t) => {
        t.plan(3);
        await setupTestData()

        const dbQueryResult = await knex(instructorModel.INSTRUCTOR_TABLE_NAME).where(
            "name",
            "Ram Rai"
        );

        t.true(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/.test(dbQueryResult[0].id)
            ,
            "Must generate an id of 36 characters in length in the standard format for UUID used by Postgres)"
        );

        const expectedResult = { name: "Ram Rai", post: "Senior Engineer" }
        t.is(
            dbQueryResult[0].name,
            expectedResult.name,
            "Must return the correct name"
        );
        t.is(
            dbQueryResult[0].post,
            expectedResult.post,
            "Must return the correct post"
        );
    })


test.serial(
    "findAllInstructors > Returns all the inserted data", async (t) => {

        await setupTestData();
        const dbFindResults = await instructorModel.findAllInstructors();
        const expectedResult = [{ name: "Ram Rai", post: "Senior Engineer" },
        { name: "Hari lama", post: "Senior Engineer I" },
        { name: "Hasina Ray", post: "Associate Engineer I" }]
        //console.log(dbQueryResults)
        t.is(expectedResult.length, dbFindResults.length, "Must return same numbers of data");

        for (let i = 0; i < expectedResult.length; i++) {
            t.is(expectedResult[i].name, dbFindResults[i].name, "Must return correct name");
            t.is(expectedResult[i].post, dbFindResults[i].post, "Must return correct name");
        }
    }
);


test.serial("updateInstructorById > returns updated instructor ", async (t) => {
    t.plan(2);


    await setupTestData();
    const dbQueryResult = await knex(instructorModel.INSTRUCTOR_TABLE_NAME).where(
        "name",
        "Ram Rai"
    );
    updateData = { post: "Associate Engineer" }
    const updatedResult = await instructorModel.updateInstructorById(dbQueryResult[0].id, updateData);
    const expectedResult = { name: "Ram Rai", post: "Associate Engineer" };

    t.is(
        updatedResult[0].name,
        expectedResult.name,
        "Must return the correct name"
    );
    t.is(
        updatedResult[0].post,
        expectedResult.post,
        "Must return the correct post"
    );

});

test.serial("updateInstructorById > Updates a instructor", async (t) => {

    t.plan(2);
    await setupTestData();
    const dbQueryFind = await knex(instructorModel.INSTRUCTOR_TABLE_NAME).where(
        "name",
        "Ram Rai"
    );
    await instructorModel.updateInstructorById(dbQueryFind[0].id, { post: "Associate Engineer" });

    const dbQueryResult = await knex(instructorModel.INSTRUCTOR_TABLE_NAME).where(
        "id",
        dbQueryFind[0].id
    );
    const expectedResult = { name: "Ram Rai", post: "Associate Engineer" };

    t.is(
        dbQueryResult[0].name,
        expectedResult.name,
        "Must return the correct updated name"
    );
    t.is(
        dbQueryResult[0].post,
        expectedResult.post,
        "Must return the correct updated post"
    );

});


test.serial("deleteInstructorById > Deletes the topic whose id is passed ", async (t) => {
    t.plan(1);

    await setupTestData();
    const dbQueryFind = await knex(instructorModel.INSTRUCTOR_TABLE_NAME).where(
        "name",
        "Ram Rai"
    );

    const deletedInstructor = await instructorModel.deleteInstructorById(dbQueryFind[0].id)
    // console.log(deletedInstructor); //1
    t.is(deletedInstructor, 1, " Deleted item must not have data.")
})

test.serial("deleteInstructorById > Does not throw when deleting non-existent topic", async (t) => {
    t.plan(1);
    await setupTestData();
    const dbQueryFind = await knex(instructorModel.INSTRUCTOR_TABLE_NAME).where(
        "name",
        "Ram Rai"
    );

    const deletedInstructor = await instructorModel.deleteInstructorById(dbQueryFind[0].id)


    await t.notThrowsAsync(
        () => instructorModel.deleteInstructorById(dbQueryFind[0].id),
        "Must not throw error when  deleting non-existent topic"
    )
})
