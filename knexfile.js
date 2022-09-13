require("dotenv").config();

module.exports = {
  client: "pg",
  connection: process.env.DATABASE_CONNECTION_STRING,
};
