const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../secrets");
const prisma = require("../prisma/prisma");

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");

  if (!token) {
    return res.status(401).send({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(401).send({ error: "User not found" });
    }

    req.user = user;

    next();
  } catch (err) {
    res.status(401).send({ error: "Invalid token" });
  }
};

module.exports = authMiddleware;
