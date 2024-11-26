const prisma = require("../prisma/prisma");

const getTransactionsByUserId = async (req, res) => {
  try {
    const { skip, take, page, pageSize } = req.pagination;
    const { userId, search, searchDate } = req.body;

    const searchConditions = search
      ? {
          OR: [
            {
              receiver: {
                firstName: {
                  contains: search,
                },
              },
            },
            {
              receiver: {
                lastName: {
                  contains: search,
                },
              },
            },
            {
              sender: {
                firstName: {
                  contains: search,
                },
              },
            },
            {
              sender: {
                lastName: {
                  contains: search,
                },
              },
            },
            {
              type: {
                contains: search,
              },
            },
            {
              amount: !isNaN(parseFloat(search))
                ? {
                    equals: parseFloat(search),
                  }
                : undefined,
            },
          ].filter(
            (condition) =>
              condition.amount !== undefined ||
              condition.receiver ||
              condition.sender ||
              condition.type
          ),
        }
      : {};

    if (searchDate && searchDate.length === 2) {
      if (searchDate[0] && searchDate[1]) {
        const startDate = new Date(searchDate[0]);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(searchDate[1]);
        endDate.setHours(23, 59, 59, 999);

        searchConditions.AND = [
          {
            createdAt: {
              gte: startDate,
              lte: endDate,
            },
          },
        ];
      }
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [{ senderId: parseInt(userId) }, { receiverId: parseInt(userId) }],
        ...searchConditions,
      },
      skip: skip,
      take: take,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        type: true,
        amount: true,
        senderId: true,
        receiverId: true,
        createdAt: true,
        sender: {
          select: {
            fullName: true,
            firstName: true,
            lastName: true,
          },
        },
        receiver: {
          select: {
            fullName: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    const typeCounts = await prisma.transaction.groupBy({
      by: ["type"],
      where: {
        OR: [{ senderId: parseInt(userId) }, { receiverId: parseInt(userId) }],
        ...searchConditions,
      },
      _count: {
        type: true,
      },
    });

    const totalTransactions = typeCounts.reduce(
      (acc, typeCount) => acc + typeCount._count.type,
      0
    );

    const formattedTransactions = transactions.map((transaction) => {
      let typeDescription;
      let counterparty;
      let amount = transaction.amount;

      if (transaction.type === "ยืมเงิน") {
        typeDescription =
          transaction.senderId === parseInt(userId) ? "ยืมเงิน" : "ให้ยืมเงิน";
        counterparty =
          transaction.senderId === parseInt(userId)
            ? transaction.receiver.fullName
            : transaction.sender.fullName;
        if (transaction.receiverId === parseInt(userId)) {
          amount = -amount;
        }
      } else if (transaction.type === "คืนเงิน") {
        typeDescription =
          transaction.senderId === parseInt(userId)
            ? "คืนเงิน"
            : "ได้รับคืนเงิน";
        counterparty =
          transaction.senderId === parseInt(userId)
            ? transaction.receiver.fullName
            : transaction.sender.fullName;
        if (transaction.senderId === parseInt(userId)) {
          amount = -amount;
        }
      }

      return {
        id: transaction.id,
        type: typeDescription,
        amount: amount,
        counterparty: counterparty,
        createdAt: transaction.createdAt,
      };
    });

    const allTypes = ["ยืมเงิน", "ได้รับเงินคืน", "ให้ยืมเงิน", "คืนเงิน"];
    const typeCountMap = typeCounts.reduce((acc, typeCounts) => {
      acc[typeCounts.type] = typeCounts._count.type;
      return acc;
    }, {});

    const typeCountArray = allTypes.map((type) => ({
      type: type,
      countType: typeCountMap[type] || 0,
    }));

    res.status(200).json({
      data: {
        message: "SUCCESS",
        page: page,
        pageSize: pageSize,
        total: totalTransactions,
        transactions: formattedTransactions,
        totalTransactions,
        typeCount: typeCountArray,
      },
    });
  } catch (error) {
    next(error);
  }
};

const repay = async (req, res) => {
  try {
    const { senderId, receiverId, amount, type } = req.body;

    if (type !== "คืนเงิน") {
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
