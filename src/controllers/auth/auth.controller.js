const { asyncErrorHandler } = require("../../utils/ErrorHandler");

const testController = asyncErrorHandler(async (req, res, next) => {
  res
    .cookie("test", "cookie test", { signed: true, httpOnly: true })
    .send("test ok");
});

module.exports = { testController };
