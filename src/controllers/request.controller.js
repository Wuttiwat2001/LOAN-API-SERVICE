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

module.exports = { requestBorrow };
