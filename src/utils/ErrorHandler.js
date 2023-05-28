const config = require("../config/config");

// handle errors in dev env
const handleDevErrorRes = (res, err) => {
  res.locals.errorMessage = err.message;
  res.status(err.statusCode).send({
    statusCode: err.statusCode,
    status: err.status,
    message: err.message,
    stackTrace: err.stack,
  });
};

// handle errors in production env
const handleProdErrorRes = (res, err) => {
  res.locals.errorMessage = err.message;
  if (err.isOperational) {
    res.status(err.statusCode).send({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).send({
      status: "error",
      message: "Something went wrong! please try again later",
    });
  }
};

// global error handler function
const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Someting went wrong! please try again later";
  if (config.env === "dev") {
    handleDevErrorRes(res, err);
  } else if (config.env === "production") {
    handleProdErrorRes(res, err);
  }
};

// handle asyncronous errors in our controllers
const asyncErrorHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
  };
};

module.exports = {
  globalErrorHandler,
  asyncErrorHandler,
};
