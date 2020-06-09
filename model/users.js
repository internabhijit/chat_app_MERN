"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UsersSchema = new Schema({
  userId: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  mobileNo: {
    type: Number,
    required: true,
    unique: true,
  },
});

const Users = mongoose.model("users", UsersSchema, "users");

module.exports = Users;
