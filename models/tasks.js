// Importamos mongoose para hacer Schemas para hacer docs
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  priority: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Task", taskSchema);
