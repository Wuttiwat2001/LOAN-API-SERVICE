const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const { PORT } = require("./secrets");
const rootRouter = require("../routes/index");

const app = express();
app.use(bodyParser.json());
app.use(morgan("dev"));

app.use("/api", rootRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
