const prisma = require("../prisma/prisma");

const getRequestSenderByUserId = async (req, res) => {
  try {
    const { skip, take, page, pageSize } = req.pagination;
    const { userId, search,searchDate } = req.body;

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

    const requests = await prisma.request.findMany({
      where: {
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
        amount: true,
        status: true,
        description: true,
        senderId: true,
        receiverId: true,
        createdAt: true,
        updatedAt: true,
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

    const totalRequests = await prisma.request.count({
      where: {
        senderId: parseInt(userId),
        ...searchConditions,
      },
    });

    const formattedRequests = requests.map((request) => {
      let counterparty;

      if (request.receiverId) {
        counterparty = request.receiver.fullName;
      }

      return {
        ...request,
        counterparty: counterparty,
        status: request.status,
      };
    });

    res.status(200).json({
      data: {
        page: page,
        pageSize: pageSize,
        message: "SUCCESS",
        requests: formattedRequests,
        totalRequests,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const requestBorrow = async (req, res) => {
  try {
    const { senderId, receiverId, amount, description } = req.body;

    const request = await prisma.request.create({
      data: {
        senderId,
        receiverId,
        amount,
        description,
        status: "รอดำเนินการ",
      },
    });

    res.status(201).json({
      data: {
        message: "SUCCESS",
        request,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const approveOrRejectRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["อนุมัติ", "ปฏิเสธ"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const request = await prisma.request.update({
      where: { id: parseInt(id) },
      data: { status },
    });

    if (status === "อนุมัติ") {
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

module.exports = {
  requestBorrow,
  approveOrRejectRequest,
  getRequestSenderByUserId,
};
