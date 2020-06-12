"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessagesSchema = new Schema({
  conversationId: {
    type: String,
    required: true,
  },
  messageType: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  messageStatus: {
    type: String,
    required: true,
  },
  sentBy: {
    type: Number,
    required: true,
  },
  sentByName: {
    type: String,
    required: true,
  },
  sentOn: { type: Date, default: Date.now },
});

const Messages = mongoose.model("messages", MessagesSchema, "messages");

module.exports = Messages;
