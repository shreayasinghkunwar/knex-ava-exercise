## Project Setup

### Install Dependencies
[PostgreSQL](https://www.postgresql.org/)

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


