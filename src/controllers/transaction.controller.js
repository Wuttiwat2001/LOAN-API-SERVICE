const prisma = require("../prisma/prisma");

const getTransactionsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [{ senderId: parseInt(userId) }, { receiverId: parseInt(userId) }],
      },
      select: {
        id: true,
        type: true,
        amount: true,
        senderId: true,
        receiverId: true,
        sender: {
          select: {
            username: true,
          },
        },
        receiver: {
          select: {
            username: true,
          },
        },
      },
    });

    const formattedTransactions = transactions.map((transaction) => {
      let typeDescription;
      let counterparty;

      if (transaction.type === "BORROW") {
        typeDescription = transaction.senderId === parseInt(userId) ? "ยืมเงิน" : "ให้ยืมเงิน";
        counterparty = transaction.senderId === parseInt(userId)
          ? transaction.receiver.username
          : transaction.sender.username;
      } else if (transaction.type === "REPAY") {
        typeDescription = transaction.senderId === parseInt(userId) ? "คืนเงิน" : "ได้รับคืนเงิน";
        counterparty = transaction.senderId === parseInt(userId)
          ? transaction.receiver.username
          : transaction.sender.username;
      }

      return {
        id: transaction.id,
        type: typeDescription,
        amount: transaction.amount,
        counterparty: counterparty,
      };
    });

    res.status(200).json(formattedTransactions);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

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

module.exports = { repay, getTransactionsByUserId };
