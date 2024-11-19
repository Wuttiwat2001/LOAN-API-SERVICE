const prisma = require("../prisma/prisma");

const requestBorrow = async (req, res) => {
  try {
    const { senderId, receiverId, amount } = req.body;

    const request = await prisma.request.create({
      data: {
        senderId,
        receiverId,
        amount,
        status: "PENDING",
      },
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const approveOrRejectRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const request = await prisma.request.update({
      where: { id: parseInt(id) },
      data: { status },
    });

    if (status === "APPROVED") {
      await prisma.transaction.create({
        data: {
          senderId: request.senderId,
          receiverId: request.receiverId,
          amount: request.amount,
          type: "BORROW",
        },
      });
    }

    res.status(200).json(request);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { requestBorrow, approveOrRejectRequest };
