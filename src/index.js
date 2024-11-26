const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const { PORT } = require("./secrets");
const rootRouter = require("./routes/index");
const cors = require("cors")
const errorHandler = require("./middlewares/errorHandler");

const app = express();
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(cors({
  origin: "*"
}))

app.use("/api", rootRouter);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
