const prisma = require("../prisma/prisma");

const getTransactionsByUserId = async (req, res, next) => {
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

    const incomeTransactions = formattedTransactions.reduce(
      (acc, transaction) => {
        if (
          transaction.type === "ยืมเงิน" ||
          transaction.type === "ได้รับคืนเงิน"
        ) {
          acc.count += 1;
          acc.amount += transaction.amount;
        }
        return acc;
      },
      { count: 0, amount: 0 }
    );

    const expenseTransactions = formattedTransactions.reduce(
      (acc, transaction) => {
        if (
          transaction.type === "ให้ยืมเงิน" ||
          transaction.type === "คืนเงิน"
        ) {
          acc.count += 1;
          acc.amount += transaction.amount;
        }
        return acc;
      },
      { count: 0, amount: 0 }
    );

    res.status(200).json({
      data: {
        message: "SUCCESS",
        page: page,
        pageSize: pageSize,
        transactions: formattedTransactions,
        totalTransactions,
        typeCount: typeCountArray,
        incomeTransactions,
        expenseTransactions,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getTransactionSenderByUserId = async (req, res, next) => {
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
              status: {
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
              condition.status
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
        type: "ยืมเงิน",
        senderId: parseInt(userId),
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
        isBorrow: true,
        createdAt: true,
        updatedAt: true,
        receiver: {
          select: {
            fullName: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    const formattedRequests = transactions.map((transaction) => {
      let counterparty;

      if (transaction.receiver) {
        counterparty = transaction.receiver.fullName;
      }

      return {
        id: transaction.id,
        type: transaction.type,
        amount: transaction.amount,
        counterparty: counterparty,
        isBorrow: transaction.isBorrow,
        createdAt: transaction.createdAt,
        updatedAt: transaction.updatedAt,
      };
    });

    const paidTransactions = formattedRequests.reduce(
      (acc, transaction) => {
        if (transaction.isBorrow) {
          acc.count += 1;
          acc.amount += transaction.amount;
        }
        return acc;
      },
      { count: 0, amount: 0 }
    );

    const outstandingTransactions = formattedRequests.reduce(
      (acc, transaction) => {
        if (!transaction.isBorrow) {
          acc.count += 1;
          acc.amount += transaction.amount;
        }
        return acc;
      },
      { count: 0, amount: 0 }
    );

    const totalTransactions = await prisma.transaction.count({
      where: {
        type: "ยืมเงิน",
        senderId: parseInt(userId),
        ...searchConditions,
      },
    });

    res.status(200).json({
      data: {
        message: "SUCCESS",
        page: page,
        pageSize: pageSize,
        transactions: formattedRequests,
        paidTransactions,
        outstandingTransactions,
        totalTransactions,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getTransactionReceiverByUserId = async (req, res, next) => {
  try {
    const { skip, take, page, pageSize } = req.pagination;
    const { userId, search, searchDate } = req.body;

    const searchConditions = search
      ? {
          OR: [
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
              status: {
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
              condition.sender ||
              condition.status
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
        type: "ยืมเงิน",
        receiverId: parseInt(userId),
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
        isBorrow: true,
        createdAt: true,
        updatedAt: true,
        sender: {
          select: {
            fullName: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    const formattedRequests = transactions.map((transaction) => {
      let counterparty;

      if (transaction.sender) {
        counterparty = transaction.sender.fullName;
      }

      return {
        id: transaction.id,
        type: transaction.type,
        amount: transaction.amount,
        counterparty: counterparty,
        isBorrow: transaction.isBorrow,
        createdAt: transaction.createdAt,
        updatedAt: transaction.updatedAt,
      };
    });

    const paidTransactions = formattedRequests.reduce(
      (acc, transaction) => {
        if (transaction.isBorrow) {
          acc.count += 1;
          acc.amount += transaction.amount;
        }
        return acc;
      },
      { count: 0, amount: 0 }
    );

    const outstandingTransactions = formattedRequests.reduce(
      (acc, transaction) => {
        if (!transaction.isBorrow) {
          acc.count += 1;
          acc.amount += transaction.amount;
        }
        return acc;
      },
      { count: 0, amount: 0 }
    );

    const totalTransactions = await prisma.transaction.count({
      where: {
        type: "ยืมเงิน",
        receiverId: parseInt(userId),
        ...searchConditions,
      },
    });

    res.status(200).json({
      data: {
        message: "SUCCESS",
        page: page,
        pageSize: pageSize,
        transactions: formattedRequests,
        paidTransactions,
        outstandingTransactions,
        totalTransactions,
      },
    });
  } catch (error) {
    next(error);
  }
}

const repay = async (req, res, next) => {
  try {
    const { transactionId } = req.body;

    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction) {
      return res.status(404).json({ error: "ไม่เจอธุรกรรมที่ค้นหา" });
    }

    if (transaction.type !== "ยืมเงิน") {
      return res.status(400).json({ error: "กรุณาระบุประเภทให้ถูกต้อง" });
    }
    const updatedTransaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        isBorrow: true,
      },
    });
    const repaymentTransaction = await prisma.transaction.create({
      data: {
        senderId: transaction.senderId,
        receiverId: transaction.receiverId,
        amount: transaction.amount,
        type: "คืนเงิน",
      },
    });

    const updatedSender = await prisma.user.update({
      where: { id: transaction.senderId },
      data: {
        balance: {
          decrement: transaction.amount,
        },
      },
    });

    const updatedReceiver = await prisma.user.update({
      where: { id: transaction.receiverId },
      data: {
        balance: {
          increment: transaction.amount,
        },
      },
    });

    res.status(201).json({
      data: {
        message: "SUCCESS",
        updatedTransaction,
        repaymentTransaction,
        updatedSender,
        updatedReceiver,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  repay,
  getTransactionsByUserId,
  getTransactionSenderByUserId,
};
