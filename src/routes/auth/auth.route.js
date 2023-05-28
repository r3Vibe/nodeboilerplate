const express = require("express");
const { testController } = require("../../controllers/index");

const router = express.Router();

router.get("/test", testController);

module.exports = router;
