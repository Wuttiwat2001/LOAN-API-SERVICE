const express = require("express");
const requestRoutes = express.Router();
const authMiddleware = require("../middlewares/auth");
const paginationMiddleware = require("../middlewares/pagination");
const { requestBorrow, approveOrRejectRequest,getRequestSenderByUserId,getRequestReceiverByUserId } = require("../controllers/request.controller")

requestRoutes.post("/requestSender", [authMiddleware,paginationMiddleware], getRequestSenderByUserId);
requestRoutes.post("/requestReceiver", [authMiddleware,paginationMiddleware], getRequestReceiverByUserId);
requestRoutes.post("/requestBorrow", [authMiddleware], requestBorrow);
requestRoutes.post("/approveOrRejectRequest/:id", [authMiddleware], approveOrRejectRequest);


module.exports = requestRoutes;
