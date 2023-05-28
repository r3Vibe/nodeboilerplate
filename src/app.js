const express = require("express");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const cors = require("cors");
const compression = require("compression");
const { successHandler, errorHandler } = require("./config/morgan");
const config = require("./config/config");
const { globalErrorHandler } = require("./utils/ErrorHandler");
const ApiError = require("./utils/ApiError");
const router = require("./routes/index");
const limiter = require("./utils/RateLimit");
const cookieParser = require("cookie-parser");

const app = express();

// sets http headers to the response
app.use(helmet());

// parse json data to req.body
app.use(
  express.json({
    limit: "1kb",
  })
);

// parse cookies to req.cookies
app.use(cookieParser("gfg"));

// prevent cross site scripting attacks
app.use(xss());

// sanitize user input to prevent any malicious database operations
app.use(mongoSanitize());

// enable cross origin resource sharing(CORS)
app.use(
  cors({
    origin: "*",
  })
);

// compress all the response
app.use(compression());

// user morgan and winston logger in dev and prod env
if (config.env !== "test") {
  app.use(successHandler);
  app.use(errorHandler);
}

// use rate limiter to an end point
if (config.env === "production") {
  app.use("/api/v1/auth", limiter);
}

// site routes
app.use("/api/v1", router);

app.use("*", (req, res, next) => {
  next(new ApiError(`Could not found ${req.originalUrl} on the server`, 404));
});

// handle all errors globally
app.use(globalErrorHandler);

module.exports = app;
