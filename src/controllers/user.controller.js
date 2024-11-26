const prisma = require("../prisma/prisma");

const allUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();

    res.status(200).json({
      data: {
        message: "SUCCESS",
        users: users,
      },
    });
  } catch (error) {
    next(error);
  }
};

const balanceById = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(userId),
      },
      select: {
        id: true,
        balance: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      data: {
        message: "SUCCESS",
        user
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  allUsers,
  balanceById,
};
