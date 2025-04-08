const express = require("express");
const Routes = express.Router();
const upload = require("../multer/multer");

const userController = require("../controller/user.controller");

Routes.post("/signup", userController.signup);

Routes.post("/login", userController.login);

Routes.post("/delete-user", userController.deleteUser);

Routes.post("/get-user", userController.getUser);

Routes.post("/update-user", upload.single("image"), userController.updateUser);

Routes.get("/get-all-users", userController.getAllUsers);

module.exports = Routes;
