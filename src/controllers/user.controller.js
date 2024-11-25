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

module.exports = {
  allUsers,
};
