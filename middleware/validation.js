const jwt = require("jsonwebtoken");

let validate = (req, res, next) => {
  jwt.verify(
    req.headers.token,
    "This is the most secure key for tmp",
    function (err, decoded) {
      if (err || !decoded.userId) {
        return res.send({
          success: 0,
          loggedIn: 0,
          message: "Token expires please login again",
        });
      }

      req["body"]["userObjId"] = decoded._id;
      req["body"]["name"] = decoded.name;
      req["body"]["userId"] = decoded.userId;

      next();
    }
  );
};

module.exports = { validate };
