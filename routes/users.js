let express = require("express");
let router = express.Router();

let { registerUsers } = require("../controllers/users");
let { validate } = require("../middleware/validation");

router.get("/", validate, registerUsers);

module.exports = router;
