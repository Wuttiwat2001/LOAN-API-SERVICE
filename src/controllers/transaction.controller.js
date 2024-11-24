const prisma = require("../prisma/prisma");

const getTransactionsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const { skip, take, page, pageSize } = req.pagination;

    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [{ senderId: parseInt(userId) }, { receiverId: parseInt(userId) }],
      },
      skip: skip,
      take: take,
      select: {
        id: true,
        type: true,
        amount: true,
        senderId: true,
        receiverId: true,
        createdAt: true,
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

    const totalTransactions = await prisma.transaction.count({
      where: {
        OR: [{ senderId: parseInt(userId) }, { receiverId: parseInt(userId) }],
      },
    });

    const formattedTransactions = transactions.map((transaction, index) => {
      let typeDescription;
      let counterparty;
      let amount = transaction.amount;

      if (transaction.type === "BORROW") {
        typeDescription =
          transaction.senderId === parseInt(userId) ? "ยืมเงิน" : "ให้ยืมเงิน";
        counterparty =
          transaction.senderId === parseInt(userId)
            ? transaction.receiver.username
            : transaction.sender.username;
        if (transaction.receiverId === parseInt(userId)) {
          amount = -amount;
        }
      } else if (transaction.type === "REPAY") {
        typeDescription =
          transaction.senderId === parseInt(userId)
            ? "คืนเงิน"
            : "ได้รับคืนเงิน";
        counterparty =
          transaction.senderId === parseInt(userId)
            ? transaction.receiver.username
            : transaction.sender.username;
        if (transaction.senderId === parseInt(userId)) {
          amount = -amount;
        }
      }

      return {
        index: index + 1,
        id: transaction.id,
        type: typeDescription,
        amount: amount,
        counterparty: counterparty,
        createdAt: transaction.createdAt,
      };
    });

    res.status(200).json({
      data: {
        message: "SUCCESS",
        page: page,
        pageSize: pageSize,
        total: totalTransactions,
        transactions: formattedTransactions,
      },
    });
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
