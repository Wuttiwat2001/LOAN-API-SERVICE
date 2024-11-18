const express = require("express");
const rootRouter = express.Router();

rootRouter.get("/", (req, res) => {
  res.send("Hello from the router!");
});

module.exports = rootRouter;
