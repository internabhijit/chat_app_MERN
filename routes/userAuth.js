let express = require("express");
let router = express.Router();

let authController = require("../controllers/userAuth");

router.post("/login", authController.login);
router.post("/registration", authController.registration);
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  // res.render('login');
});

module.exports = router;
