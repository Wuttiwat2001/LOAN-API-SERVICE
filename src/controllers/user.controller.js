const prisma = require("../prisma/prisma");

const allUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();

    res.status(200).json({
      data: {
        message: "SUCCESS",
        users: users,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const findUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      data: {
        message: "SUCCESS",
        user: user,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  allUsers,
  findUserById,
};
