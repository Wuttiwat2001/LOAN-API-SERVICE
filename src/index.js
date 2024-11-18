const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const { PORT } = require("./secrets");

const app = express();
app.use(bodyParser.json());
app.use(morgan('dev'))

app.get("/", (req, res) => {
    res.send("Hello World");
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
