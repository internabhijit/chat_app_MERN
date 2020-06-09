let express = require("express");
let router = express.Router();

let authController = require("../controllers/userAuth");
let { validate } = require("../middleware/validation");

router.post("/login", authController.login);
router.post("/registration", authController.registration);
router.get("/users", validate, authController.users);
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  // res.render('login');
});

module.exports = router;
