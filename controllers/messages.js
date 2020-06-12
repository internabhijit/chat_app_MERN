const Messages = require("../model/messages");

const getMsgsById = async (req, res) => {
  const { conversationId } = req.query;
  const { userId, name, _id } = req.body;

  const messages = await Messages.find({ conversationId }).select({
    _id: 0,
  });

  if (messages.length < 1) {
    return res.status(200).send({
      success: 0,
      message: "No messages yet sent",
    });
  }
  let logInUser = { _id, name, userId };
  res.send({ success: 1, logInUser, data: messages });
};

const addNewMsg = async (req, res) => {
  let {
    conversationId,
    messageType,
    message,
    messageStatus,
    sentBy,
    sentByName,
  } = req.body;

  sentBy = Number(sentBy);

  let addMessage = {
    conversationId,
    messageType,
    message,
    messageStatus,
    sentBy,
    sentByName,
  };

  try {
    addMessage = new Messages(addMessage);
    await addMessage.save();
    res.send({
      success: 1,
      message: "Messages Successfully Added",
    });
  } catch (error) {
    res.send({
      success: 0,
      message: "Something Went Wrong",
      error,
    });
  }
};

const updateMsgStatus = async (req, res) => {
  let { conversationId, messageStatus, sentBy } = req.body;
  sentBy = Number(sentBy);

  const message = await Messages.updateMany(
    {
      conversationId,
      sentBy,
    },
    {
      $set: { messageStatus },
    }
  );
  return res.send(message);
};

module.exports = { getMsgsById, addNewMsg, updateMsgStatus };
