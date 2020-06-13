const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const User = require("../model/users");
const Conversation = require("../model/conversation");
const Message = require("../model/messages");

const sharedController = require("./shared");

const activeUsers = [];
const onlineUsers = [];

let login = async (req, res) => {
  const password = crypto
    .createHash("sha256")
    .update(req.body.password)
    .digest("base64");

  let user = await User.findOne({
    email: req.body.email,
    password: password,
  }).select({ password: 0 });

  if (!user) {
    return res.send({ success: 0, message: "Invalid credentials" });
  }

  const token = jwt.sign(user.toJSON(), "This is the most secure key for tmp", {
    expiresIn: "9h",
  });
  let userId = user.userId;
  let userIndex = onlineUsers.findIndex((u) => u === userId);

  if (userIndex === -1) onlineUsers.push(userId);

  let regexString = `${userId}_|_${userId}`;

  // When User Login Mark Message Status To DELIVERED Which Are SENT To Him/Her
  await Message.updateMany(
    {
      sentBy: { $ne: userId },
      messageStatus: "SENT",
      conversationId: { $regex: regexString },
    },
    {
      $set: { messageStatus: "DELIVERED" },
    }
  );

  res.send({ success: 1, loggedInUser: user, token: token });
};

let registration = async (req, res) => {
  let { email, mobileNo } = req.body;
  mobileNo = Number(mobileNo);

  let user = await User.findOne({
    $or: [{ email }, { mobileNo }],
  }).select({ _id: 0, password: 0 });

  if (user) {
    let message = "";

    if (user.email === email && user.mobileNo === mobileNo) {
      message = "Email Id and Mobile No. Already Exist";
    } else if (user.mobileNo === mobileNo) {
      message = "Mobile No. Already Exist";
    } else {
      message = "Email Id  Already Exist";
    }

    return res.status(200).send({
      success: 0,
      message,
    });
  }

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

// Local Functions
const addUser = async ({ id, name, room, senderId }) => {
  try {
    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();

    let user = await Conversation.findOne({ id: room });

    if (!user) {
      let participants = room.split("_").map((n) => Number(n));
      let conversation = {
        id: room,
        participants: participants,
      };
      conversation = new Conversation(conversation);

      await conversation.save();
    }

    user = { id, name, room, senderId };

    activeUsers.push(user);

    return { user };
  } catch (error) {
    return { error: "Error While Adding User" };
  }
};

const removeUser = (id) => {
  const index = activeUsers.findIndex((user) => user.id === id);

  if (index !== -1) {
    return activeUsers.splice(index, 1)[0];
  }
};

const getUsers = (id) => {
  let user = activeUsers.find((user) => user.id === id);

  if (user) return { user };

  return { error: "Username is taken" };
};

const isUserOnline = (userId) =>
  onlineUsers.findIndex((isActive) => isActive === userId);

const logout = (req, res) => {
  let index = onlineUsers.findIndex((isActive) => isActive === req.body.userId);

  if (index !== -1) {
    onlineUsers.splice(index, 1)[0];

    return res.send({ success: 1, message: `Users ${req.body.userId} Logout` });
  }

  res.send({ success: 0, message: `Users ${req.body.userId} Not Found` });
};

const getUsersInRoom = (room) =>
  activeUsers.filter((user) => user.room === room);

module.exports = {
  login,
  registration,
  addUser,
  removeUser,
  getUsers,
  getUsersInRoom,
  isUserOnline,
  logout,
  onlineUsers,
};
