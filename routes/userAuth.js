let express = require("express");
let router = express.Router();

let { login, registration, logout } = require("../controllers/userAuth");
let { validate } = require("../middleware/validation");

router.get("/", (req, res) => {
  res.send("Server Is Running");
});
router.post("/login", login);
router.post("/registration", registration);
router.get("/logout", validate, logout);

module.exports = router;
