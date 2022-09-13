## Project Setup

### Install Dependencies
[PostgreSQL](https://www.postgresql.org/)
Note that this database will ONLY BE USED FOR TESTS in this project

### Install Node Dependencies
```
npm install
```

### Run Migrations
```
npx knex migrate:latest
```

### Prepare Environment
Create a new file named `.env` and add the following to it:
```
DATABASE_CONNECTION_STRING=url://connection@string/to/postgress/database
```

## Scripts

### Running Tests
```
npm test
```
Look under `scripts.test` in `package.json` to see how this is set up.

We clear database before running the test so that we always have a clean database to work with and don't end up getting errors for repeating a primary key.

### To run a specific test
```
npm test path/to/file.test.js
```

Example:
```
npm test src/models/week/index.test.js
```

## TODO

FORK this repository before starting to do anything. There is a `Fork` button at the top of this repository page.

1. Complete the todo tests for the [week](src/models/week/index.test.js) and [topic](src/models/topic/index.test.js) models.
2. Create a new table called instructors. Use any fields that you want.
3. Create a model for instructors inside `./src/models`.
4. Link each week to an instructor. An instructor might be the instructor for more than one week. (one to many relationship)
5. Modify week models to handle instructor information.
6. Run week tests and see them fail. Modify the tests to meet the new requirements.
7. Write tests for instructors model covering at least creation, read, update and deletion (CRUD). You will be using your database as a test database.

## Resources

#### Knex Migrations
https://knexjs.org/guide/migrations.html - Dealing with Knex migrations

https://knexjs.org/guide/schema-builder.html#createtable - Knex Schema Builder

#### Writing Tests
We are using [`ava`](https://github.com/avajs/ava) as our test runner.

Read [this link](https://github.com/avajs/ava/blob/main/docs/01-writing-tests.md) for a reference on how to `declare tests` using ava.

Read [this link](https://github.com/avajs/ava/blob/main/docs/03-assertions.md) for a reference on how to `write assertions` using ava.

Take a look at the [week test file](./src/models/week/index.test.js) for an example. But remember that you will need to modify these tests.

#### Relationship Modeling
https://www.tutorialsteacher.com/sqlserver/tables-relations
https://stackoverflow.com/questions/7296846/how-to-implement-one-to-one-one-to-many-and-many-to-many-relationships-while-de
https://blog.devart.com/types-of-relationships-in-sql-server-database.html
