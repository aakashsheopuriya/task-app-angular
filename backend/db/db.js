const mongoose = require("mongoose");
const dbConnect = async() => {
  mongoose
    .connect("mongodb://127.0.0.1:27017/task")
    .then(() => {
      console.log("database connected successfully");
    })
    .catch((err) => {
      console.log("database not connected", err.message);
    });
};
module.exports = dbConnect;