/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("instructors", (t) => {
        t.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
        t.string("name").notNullable();
        t.string("post").notNullable();


    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable("instructors");
};
