const express = require("express");
const cors = require("cors");
const dbConnect = require("./db/db");
const userRoutes = require("./routes/user.routes");
const taskRoutes = require("./routes/task.routes");

const app = express();
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(cors({ origin: "*" }));
dbConnect();

let port = 4000;

app.use("/user", userRoutes);

app.use("/task", taskRoutes);

app.listen(port, () => {
  console.log(`server is running on http://localhost:${port}`);
});
