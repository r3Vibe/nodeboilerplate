const app = require("./app");
const mongoose = require("mongoose");
const config = require("./config/config");
const logger = require("./config/winston");

//define server
let server;

// database connection
mongoose
  .connect(config.db_url)
  .then(() => {
    logger.info("Database Connected!");
    server = app.listen(config.port, () => {
      logger.info(`Server started at ${config.port}`);
    });
  })
  .catch((err) => {
    logger.error("Could not connect to the database");
    logger.error(`${err.name}:${err.message}`);
  });

// exit server gracefully if unhandaled errros occure
const exitHandler = (err) => {
  console.log(err);
  logger.error(`${err.name}:${err.message}`);
  if (server) {
    server.close(() => {
      logger.info("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

// habdle any promice rejection that was not caught in our code
process.on("unhandledRejection", exitHandler);
// handle any exceptions that was not handled properly
process.on("uncaughtException", exitHandler);
// close server on sigterm event
process.on("SIGTERM", (err) => {
  if (server) {
    server.close(() => {
      logger.info("Server Closed");
    });
  }
});
