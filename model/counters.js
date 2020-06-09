"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CounterSchema = new Schema({
  counterName: {
    type: String,
    required: true,
    unique: true,
  },
  counterSeq: {
    type: Number,
  },
});

const Counter = mongoose.model("counters", CounterSchema, "counters");

module.exports = Counter;
