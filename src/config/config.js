const path = require("path");
const dotenv = require("dotenv");

dotenv.config({
  path: path.join(__dirname, "../../.env"),
});

const env = process.env.ENV;
const port = process.env.PORT;
const db_url = process.env.MONGODB_URL;

module.exports = {
  env,
  port,
  db_url,
};
