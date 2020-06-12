"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ConversationSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  participants: Array,
});

const Conversation = mongoose.model(
  "conversations",
  ConversationSchema,
  "conversations"
);

module.exports = Conversation;
