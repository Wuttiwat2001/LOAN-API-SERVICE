const express = require("express");
const requestRoutes = express.Router();
const authMiddleware = require("../middlewares/auth");
const { requestBorrow, approveOrRejectRequest } = require("../controllers/request.controller");

requestRoutes.post("/requestBorrow", [authMiddleware], requestBorrow);
requestRoutes.post("/approveOrRejectRequest/:id", [authMiddleware], approveOrRejectRequest);

module.exports = requestRoutes;
