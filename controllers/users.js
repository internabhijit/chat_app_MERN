const User = require("../model/users");

let registerUsers = async (req, res) => {
  let { userId, name, _id } = req.body;

  let users = await User.find({ userId: { $ne: userId } }).select({
    name: 1,
    userId: 1,
  });

  if (users.length < 1) {
    return res.status(200).send({
      success: 0,
      message: "No users register yet",
    });
  }
  let logInUser = { _id, name, userId };
  res.send({ success: 1, logInUser, data: users });
};

module.exports = { registerUsers };
