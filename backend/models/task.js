const mongoose = require("mongoose");
const taskSchema = new mongoose.Schema({
  employeename: {
    type: String,
  },
  task: {
    type: String,
  },
  email: {
    type: String,
  },
  discription: {
    type: String,
  },
  startdate: {
    type: Date,
  },
  enddate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Completed"],
  },
  uid: {
    type: String,
  },
});

const task = new mongoose.model("Task", taskSchema);
module.exports = task;
