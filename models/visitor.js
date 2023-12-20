const mongoose = require("mongoose");

const visitorCountSchema = new mongoose.Schema({
  count: {
    type: Number,
    default: 0,
  },
  date: {
    type: Date,
    default: () => new Date().setHours(0, 0, 0, 0),
  },
});

const Visitor = mongoose.model("Visitor", visitorCountSchema);

module.exports = Visitor;
