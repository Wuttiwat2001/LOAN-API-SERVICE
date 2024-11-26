const express = require("express");
const requestRoutes = express.Router();
const authMiddleware = require("../middlewares/auth");
const paginationMiddleware = require("../middlewares/pagination");
const {
  requestBorrow,
  approveOrRejectRequest,
  getRequestSenderByUserId,
  getRequestReceiverByUserId,
} = require("../controllers/request.controller");
const {
  validateRequestBorrow,
  validateApproveOrRejectRequest,
  validateGetRequestSenderAndReceiverById,
} = require("../validators/requestValidator");
const validationMiddleware = require("../middlewares/validation");

requestRoutes.post(
  "/requestSender",
  [authMiddleware, paginationMiddleware],
  validateGetRequestSenderAndReceiverById,
  validationMiddleware,
  getRequestSenderByUserId
);
requestRoutes.post(
  "/requestReceiver",
  [authMiddleware, paginationMiddleware],
  validateGetRequestSenderAndReceiverById,
  validationMiddleware,
  getRequestReceiverByUserId
);
requestRoutes.post(
  "/requestBorrow",
  [authMiddleware],
  validateRequestBorrow,
  validationMiddleware,
  requestBorrow
);

requestRoutes.post(
  "/approveOrRejectRequest/:id",
  [authMiddleware],
  validateApproveOrRejectRequest,
  validationMiddleware,
  approveOrRejectRequest
);

module.exports = requestRoutes;
