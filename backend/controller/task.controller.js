const taskModel = require("../models/task");

const getTask = async (req, res) => {
  try {
    const { email } = req.body;
    if (email) {
      const userFind = await taskModel.findOne({ email });
      if (userFind) {
        res.send({
          message: "successfully get task",
          status: 1,
          data: userFind,
        });
      } else {
        res.send({
          message: "Email not found",
          status: 0,
        });
      }
    } else {
      res.send({
        message: "Email is required",
        status: 0,
      });
    }
  } catch (err) {
    console.log("error in catch block", err);
  }
};

const getTaskbyUid = async (req, res) => {
  try {
    const { uid } = req.body;
    if (uid) {
      const userFind = await taskModel.findOne({ uid });
      if (userFind) {
        res.send({
          message: "successfully get task",
          status: 1,
          data: userFind,
        });
      } else {
        res.send({
          message: "Uid not found",
          status: 0,
        });
      }
    } else {
      res.send({
        message: "Uid is required",
        status: 0,
      });
    }
  } catch (err) {
    console.log("error in catch block", err);
  }
};

const getAllTask = async (req, res) => {
  try {
    const userFind = await taskModel.find().sort({ enddate: 1 });
    if (userFind) {
      res.send({
        message: "successfully get tasks",
        status: 1,
        data: userFind,
      });
    } else {
      res.send({
        message: "Failed",
        status: 0,
      });
    }
  } catch (err) {
    console.log("error in catch block", err);
  }
};

const addTask = async (req, res) => {
  try {
    const {
      employeename,
      task,
      email,
      discription,
      startdate,
      enddate,
      status,
      uid,
    } = req.body;
    const taskFound = await taskModel.find({ uid });
    if (taskFound.length > 0) {
      if (
        employeename &&
        task &&
        email &&
        discription &&
        startdate &&
        enddate &&
        status &&
        uid
      ) {
        const taskUpdate = await taskModel.updateOne(
          { uid },
          {
            $set: {
              employeename,
              task,
              email,
              discription,
              startdate,
              enddate,
              status,
            },
          }
        );
        if (taskUpdate) {
          res.send({
            message: "Task Updated Successfully",
            status: 1,
          });
        } else {
          res.send({
            message: "Faild to Update task",
            status: 0,
          });
        }
      } else {
        res.send({ message: "All fields are Require to update", status: 0 });
      }
    } else {
      if (
        employeename &&
        task &&
        email &&
        discription &&
        startdate &&
        enddate &&
        status &&
        uid
      ) {
        const newTask = new taskModel({
          employeename,
          email,
          task,
          discription,
          startdate,
          enddate,
          status,
          uid,
        });
        const taskUpdate = await newTask.save();
        if (taskUpdate) {
          res.send({
            message: "Task Added Successfully",
            status: 1,
          });
        } else {
          res.send({
            message: "Faild to add task",
            status: 0,
          });
        }
      } else {
        res.send({ message: "All fields are Require to add task", status: 0 });
      }
    }
  } catch (error) {
    console.log("error in catch block", error);
  }
};

const deleteTask = async (req, res) => {
  try {
    const { uid } = req.body;
    console.log(uid);
    const taskfound = await taskModel.find({ uid });
    console.log("taskfound for delete", taskfound);
    const taskDelete = await taskModel.deleteOne({ uid });
    if (taskDelete) {
      res.send({
        message: "task Deleted successfully",
        status: 1,
        data: taskDelete,
      });
    } else {
      res.send({ message: "task not Deleted", status: 0 });
    }
  } catch (error) {
    console.log(error);
  }
};

const statusChange = async (req, res) => {
  try {
    const { uid, status } = req.body;
    const userUpdate = await taskModel.updateOne(
      { uid },
      {
        $set: {
          status,
        },
      }
    );
    if (userUpdate) {
      res.send({ message: "User details updated successfully", status: 1 });
    } else {
      res.send({ message: "User details not updated", status: 0 });
    }
  } catch (error) {
    console.log("in catch block", error.message);
  }
};

const getsearchtask = async (req, res) => {
  try {
    console.log(req.body);
    const {
      selectValue,
      startdatefrom,
      startdateto,
      enddatefrom,
      enddateto,
      status,
    } = req.body;

    if (
      startdatefrom == null &&
      startdateto == null &&
      enddatefrom == null &&
      enddateto == null &&
      status == null
    ) {
      res.send({
        message: "fields required",
        status: 0,
      });
    } else if (
      selectValue == "status" &&
      enddatefrom == null &&
      enddateto == null &&
      startdatefrom == null &&
      startdateto == null &&
      status !== null
    ) {
      const tasks = await taskModel
        .find({ status: status })
        .sort({ enddate: 1 });
      if (tasks) {
        res.send({
          message: "success",
          status: 1,
          data: tasks,
        });
      }
    } else if (
      selectValue == "enddate" &&
      enddatefrom == null &&
      enddateto == null &&
      status !== null
    ) {
      const tasks = await taskModel
        .find({ status: status })
        .sort({ enddate: 1 });
      if (tasks) {
        res.send({
          message: "success get",
          status: 1,
          data: tasks,
        });
      }
    } else if (
      selectValue == "enddate" &&
      enddatefrom !== null &&
      enddateto !== null &&
      status !== null
    ) {
      const tasks = await taskModel
        .find({
          enddate: { $gte: enddatefrom, $lte: enddateto },
          status: status,
        })
        .sort({ enddate: 1 });
      if (tasks) {
        res.send({
          message: "success ",
          status: 1,
          data: tasks,
        });
      }
    } else if (
      selectValue == "enddate" &&
      enddatefrom !== null &&
      enddateto !== null &&
      status == null
    ) {
      const tasks = await taskModel
        .find({
          enddate: { $gte: enddatefrom, $lte: enddateto },
        })
        .sort({ enddate: 1 });
      if (tasks) {
        res.send({
          message: "success",
          data: tasks,
          status: 1,
        });
      }
    } else if (
      selectValue == "enddate" &&
      enddatefrom !== null &&
      enddateto == null &&
      status == null
    ) {
      const tasks = await taskModel
        .find({
          enddate: enddatefrom,
        })
        .sort({ enddate: 1 });
      if (tasks) {
        res.send({
          message: "success",
          data: tasks,
          status: 1,
        });
      }
    } else if (
      selectValue == "enddate" &&
      enddatefrom !== null &&
      enddateto == null &&
      status !== null
    ) {
      const tasks = await taskModel
        .find({
          enddate: enddatefrom,
          status: status,
        })
        .sort({ enddate: 1 });
      if (tasks) {
        res.send({
          message: "success",
          data: tasks,
          status: 1,
        });
      }
    } else if (
      selectValue == "startdate" &&
      startdatefrom == null &&
      startdateto == null &&
      status !== null
    ) {
      const tasks = await taskModel
        .find({ status: status })
        .sort({ enddate: 1 });
      if (tasks) {
        res.send({
          message: "success get",
          status: 1,
          data: tasks,
        });
      }
    } else if (
      selectValue == "startdate" &&
      startdatefrom !== null &&
      startdateto !== null &&
      status !== null
    ) {
      const tasks = await taskModel
        .find({
          startdate: { $gte: startdatefrom, $lte: startdateto },
          status: status,
        })
        .sort({ enddate: 1 });
      if (tasks) {
        res.send({
          message: "success",
          data: tasks,
          status: 1,
        });
      }
    } else if (
      selectValue == "startdate" &&
      startdatefrom !== null &&
      startdateto !== null &&
      status == null
    ) {
      const tasks = await taskModel
        .find({
          startdate: { $gte: startdatefrom, $lte: startdateto },
        })
        .sort({ enddate: 1 });
      if (tasks) {
        res.send({
          message: "success",
          data: tasks,
          status: 1,
        });
      }
    } else if (
      selectValue == "startdate" &&
      startdatefrom !== null &&
      startdateto == null &&
      status !== null
    ) {
      const tasks = await taskModel
        .find({
          startdate: startdatefrom,
          status: status,
        })
        .sort({ enddate: 1 });
      if (tasks) {
        res.send({
          message: "success",
          data: tasks,
          status: 1,
        });
      }
    } else if (
      selectValue == "startdate" &&
      startdatefrom !== null &&
      startdateto == null &&
      status == null
    ) {
      const tasks = await taskModel
        .find({
          startdate: startdatefrom,
        })
        .sort({ enddate: 1 });
      if (tasks) {
        res.send({
          message: "success",
          data: tasks,
          status: 1,
        });
      }
    } else {
      res.send({
        message: "not found",
        status: 0,
      });
    }
  } catch (err) {
    console.log("error in catch block", err);
  }
};

const getsearchtaskbyName = async (req, res) => {
  try {
    let { inputdata } = req.body;
    const userFind = await taskModel
      .find({
        $or: [
          { employeename: { $regex: inputdata, $options: "i" } },
          { email: { $regex: inputdata, $options: "i" } },
          { discription: { $regex: inputdata, $options: "i" } },
          { task: { $regex: inputdata, $options: "i" } },
          { status: { $regex: inputdata, $options: "i" } },
        ],
      })
      .sort({ enddate: 1 });
    if (userFind.length !== 0) {
      res.send({
        message: "successfully get tasks",
        status: 1,
        data: userFind,
      });
    } else {
      res.send({
        message: "No Details Found",
        status: 0,
      });
    }
  } catch (err) {
    console.log("error in catch block", err);
  }
};

const getTaskByFilterEmail = async (req, res) => {
  let { selectedEmails } = req.body;
  console.log(selectedEmails);
  if (selectedEmails.length > 0) {
    const data = await taskModel
      .find({ email: { $in: selectedEmails } })
      .sort({ enddate: 1 });
    if (data.length > 0) {
      res.send({
        status: 1,
        message: "success",
        data: data,
      });
    } else {
      res.send({
        message: "no data found",
        status: 0,
      });
    }
  } else {
    res.send({
      message: "email is required",
      status: 0,
    });
  }
};

module.exports = {
  getTask,
  getTaskbyUid,
  getAllTask,
  addTask,
  deleteTask,
  statusChange,
  getsearchtask,
  getsearchtaskbyName,
  getTaskByFilterEmail,
};
