let express = require("express");
let router = express.Router();

let { login, registration, logout } = require("../controllers/userAuth");
let { validate } = require("../middleware/validation");

router.post("/login", login);
router.post("/registration", registration);
router.get("/logout", validate, logout);

module.exports = router;
