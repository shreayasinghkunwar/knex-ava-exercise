const { knex } = require("../../database");

const INSTRUCTOR_TABLE_NAME = "instructor";
const WEEK_TABLE_NAME = "weeks";

function getTableQueryBuilder() {
    return knex(INSTRUCTOR_TABLE_NAME);
}

function insertInstructor(name, post) {
    return getTableQueryBuilder().insert({ name, post }).returning("*");
}

/**
 * @param {{ name: string, post: string }[]} instructor
 */
function insertInstructors(instructor) {
    return getTableQueryBuilder().insert(instructor).returning("*");
}

function findAllInstructors() {
    return getTableQueryBuilder().select(`${INSTRUCTOR_TABLE_NAME}.*`);
}

function updateInstructorById(id, updateData) {
    return knex(INSTRUCTOR_TABLE_NAME).update(updateData).where({ id }).returning("*");
}

function deleteInstructorById(id) {
    //
    return knex(INSTRUCTOR_TABLE_NAME).where({ id }).del();
}



module.exports = {
    insertInstructor,
    insertInstructors,
    findAllInstructors,
    updateInstructorById,
    deleteInstructorById,
    INSTRUCTOR_TABLE_NAME,
};