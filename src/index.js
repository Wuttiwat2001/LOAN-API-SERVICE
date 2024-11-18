const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");

const app = express();
app.use(bodyParser.json());
app.use(morgan('dev'))

app.get("/", (req, res) => {
    res.send("Hello World");
})

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
