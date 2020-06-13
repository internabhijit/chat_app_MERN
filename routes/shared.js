const express = require("express");
const router = express.Router();

const { getNextSequenceValue } = require("../controllers/sharedController");

router.post("/getNextSequenceValue", getNextSequenceValue);

module.exports = router;
