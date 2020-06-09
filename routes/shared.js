const express = require("express");
const router = express.Router();

const sharedController = require("../controllers/sharedController");

router.post("/getNextSequenceValue", sharedController.getNextSequenceValue);

module.exports = router;
