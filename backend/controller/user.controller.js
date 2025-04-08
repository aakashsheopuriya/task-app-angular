const user = require("../models/user");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  try {
    console.log(req.body);
    const { firstname, lastname, email, password } = req.body;
    if (firstname && lastname && email && password) {
      const userFind = await user.findOne({ email });
      if (userFind) {
        res.send({
          message: "This email is alredy registered",
          status: 0,
        });
      } else {
        const insertUser = new user({
          firstname,
          lastname,
          email,
          password,
        });
        const isInserted = await insertUser.save();

        if (isInserted) {
          res.send({
            message: "Registration Successful",
            data: { firstname, lastname, email, password },
            status: 1,
          });
        } else {
          res.send({
            message: "All fields are Required",
            status: 0,
          });
        }
      }
    } else {
      res.send({ message: "All fields are Require", status: 0 });
    }
  } catch (error) {
    console.log("error in catch block", error);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email && password) {
      const userFind = await user.findOne({ email });
      if (userFind) {
        if (userFind.password === password) {
          var token = jwt.sign({ email: email }, "Auth", {
            expiresIn: "1d",
          });
          res.send({
            message: "user login successfully",
            status: 1,
            token: token,
            data: userFind,
          });
        } else {
          res.send({
            message:
              "Entered Username or Password is invalid, please try again",
            status: 0,
          });
        }
      } else {
        res.send({
          message: "Entered Username or Password is invalid, please try again",
          status: 0,
        });
      }
    } else {
      res.send({
        message: "All fields are Required",
        status: 0,
      });
    }
  } catch (err) {
    console.log("error in catch block", err);
  }
};

const getUser = async (req, res) => {
  try {
    const { email } = req.body;
    if (email) {
      const userFind = await user.findOne({ email });
      if (userFind) {
        res.send({
          message: "successful",
          status: 1,
          data: userFind,
          image: userFind.image
            ? `http://localhost:4000/uploads/${userFind.image}`
            : null,
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

const updateUser = async (req, res) => {
  try {
    const { email, firstname, lastname } = req.body;
    const imagePath = req.file.filename;

    const userUpdate = await user.updateOne(
      { email },
      {
        $set: {
          firstname,
          lastname,
          image: imagePath,
        },
      }
    );
    console.log(userUpdate);
    if (!userUpdate.modifiedCount == 0) {
      console.log("updated ", userUpdate);
      res.send({
        message: "User details updated successfully",
        status: 1,
        imagePath: `/uploads/${imagePath}`,
      });
    } else {
      res.send({
        message: "Enterd user details are similer to privious details",
        status: 0,
      });
    }
  } catch (error) {
    console.log("error in catch block", error);
  }
};

const getAllUsers = async (req, res) => {
  try {
    const userFind = await user.find();
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

const deleteUser = async (req, res) => {
  try {
    const email = req.body;
    console.log(Object.entries(email));
    const usrefound = await user.findOne(email);
    if (usrefound) {
      console.log(usrefound);
      const taskDelete = await user.deleteOne(email);
      if (taskDelete) {
        res.send({
          message: "User Deleted successfully",
          status: 1,
          data: taskDelete,
          user: email,
        });
      } else {
        res.send({ message: "User not Deleted", status: 0 });
      }
    } else {
      res.send({ message: "User not found", status: 0 });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  signup,
  login,
  getUser,
  updateUser,
  getAllUsers,
  deleteUser,
};
