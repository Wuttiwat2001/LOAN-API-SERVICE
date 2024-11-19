const prisma = require("../prisma/prisma");


const repay = async (req, res) => {
  try {
    const { senderId, receiverId, amount, type } = req.body;

    if (type !== "REPAY") {
      return res.status(400).json({ error: "Invalid transaction type" });
    }

    const transaction = await prisma.transaction.create({
      data: {
        senderId,
        receiverId,
        amount,
        type,
      },
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { repay };
