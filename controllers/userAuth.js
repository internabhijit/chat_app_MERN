const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const User = require("../model/users");

const sharedController = require("./shared");

let login = (req, res) => {
  const password = crypto
    .createHash("sha256")
    .update(req.body.password)
    .digest("base64");

  User.findOne({ email: req.body.email, password: password })
    .select({ password: 0 })
    .then((user) => {
      if (!user) {
        return res.send({ success: 0, message: "Invalid credentials" });
      }

      const token = jwt.sign(
        user.toJSON(),
        "This is the most secure key for tmp",
        { expiresIn: "9h" }
      );
      res.send({ success: 1, loggedInUser: user, token: token });
    })
    .catch((err) => {
      return res.send({ success: 0, message: err });
    });
};

let registration = async (req, res) => {
  // Check if this user already exisits
  let user = await User.findOne({ email: req.body.email });

  if (user)
    return res.status(200).send({
      success: 0,
      message: "Email already exist!\nTry different emailId",
    });

  const password = crypto
    .createHash("sha256")
    .update(req.body.password)
    .digest("base64");

  const userId = await sharedController.getNextSequenceValue("Users");

  req.body["userId"] = userId.counterSeq;
  req.body["password"] = password;
  req.body["name"] = req.body["name"]
    .toLowerCase()
    .split(" ")
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(" ");

  user = new User(req.body);

  await user.save();

  const token = jwt.sign(user.toJSON(), "This is the most secure key for tmp", {
    expiresIn: "9h",
  });

  res.send({ success: 1, loggedInUser: user, token: token });
};

let users = async (req, res) => {
  let users = await User.find({}).select({ name: 1, userId: 1 });

  if (users.length < 1) {
    return res.status(200).send({
      success: 0,
      message: "No users register yet",
    });
  }

  res.send({ success: 1, data: users });
};

module.exports = { login, registration, users };
