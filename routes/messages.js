let express = require("express");
let router = express.Router();

let {
  getMsgsById,
  addNewMsg,
  updateMsgStatus,
} = require("../controllers/messages");

router.get("/", getMsgsById);
router.post("/addNewMsg", addNewMsg);
router.post("/updateMsgStatus", updateMsgStatus);

module.exports = router;
