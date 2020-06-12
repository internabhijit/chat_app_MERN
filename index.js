const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const cors = require("cors");
const bodyParser = require("body-parser");

require("./config/mongoConn");

const mode = process.env.NODE_ENV;
const config =
  mode == "prod" ? require("./env/production") : require("./env/development");
const PORT = config.port;

// Models
const Messages = require("./model/messages");

// Routes
const { addUser, removeUser, getUsers, getUsersInRoom } = require("./users");
const userAuth = require("./routes/userAuth");
const users = require("./routes/users");
const messages = require("./routes/messages");
const router = require("./router");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on("connection", (socket) => {
  console.log("New User Connected", socket.id);

  socket.on("join", async ({ senderId, name, room }, callback) => {
    console.log("User Join The Room", room, "With SocketId :", socket.id);

    let secondUser = room.split("_").map((n) => Number(n));
    senderId = Number(senderId);

    secondUser = secondUser[0] === senderId ? secondUser[1] : secondUser[0];

    const { error, user } = addUser({ id: socket.id, name, room, senderId });

    if (error) return callback(error);

    try {
      await Messages.updateMany(
        {
          conversationId: room,
          sentBy: secondUser,
          messageStatus: { $ne: "DELIVERED" },
        },
        {
          $set: { messageStatus: "DELIVERED" },
        }
      );
    } catch (error) {
      return callback("Something went wrong");
    }

    socket.join(user.room);

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    callback();
  });

  socket.on("sendMessage", async (message, callback) => {
    const { error, user } = await getUsers(socket.id);

    if (error) return callback("User Not Found");
    const activeUsers = getUsersInRoom(user.room);

    let messageStatus = "SENT";

    if (activeUsers.length === 2) messageStatus = "DELIVERED";

    let addMessage = {
      conversationId: user.room,
      messageType: "TEXT",
      message: message,
      messageStatus,
      sentBy: user.senderId,
      sentByName: user.name,
    };

    try {
      addMessage = new Messages(addMessage);
      await addMessage.save();
    } catch (error) {
      return callback("Message Not Send");
    }

    io.to(user.room).emit("message", addMessage);

    io.to(user.room).emit("roomData", {
      room: user.name,
      users: getUsersInRoom(user.room),
    });

    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    console.log("********** BYE BYE ***************");

    console.log(
      "User Left The Room : ",
      user.room,
      "User Name",
      user.name,
      "User Id",
      user.senderId,
      "Socket Id",
      user.id
    );
    console.log("********** BYE BYE ***************");
  });
});

app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use("/", userAuth);
app.use("/users", users);
app.use("/messages", messages);
app.use(router);

server.listen(PORT, () =>
  console.log(
    "Express server started on PORT",
    PORT,
    "in",
    config.mode,
    "mode."
  )
);
