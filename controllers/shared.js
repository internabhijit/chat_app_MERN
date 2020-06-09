const Counter = require("../model/counters");

let getNextSequenceValue = (param) => {
  return new Promise((resolve, reject) => {
    Counter.findOneAndUpdate(
      { counterName: param },
      { $inc: { counterSeq: 1 } },
      { upsert: true, new: true }
    ).then((result) => resolve(result));
  });
};

module.exports = { getNextSequenceValue };
