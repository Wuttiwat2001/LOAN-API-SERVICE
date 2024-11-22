const prisma = require("../prisma/prisma");
const hashSync = require("bcrypt").hashSync;
const compareSync = require("bcrypt").compareSync;
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../secrets");

const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username: username }, { email: email }],
      },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Username or email already exists" });
    }

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashSync(password, 10),
      },
    });
    res.status(201).json({ message: "SUCCESS", user });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: email }, { username: email }],
      },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid email or username" });
    }

    const isPasswordValid = compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({ message: "SUCCESS", user, token });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  signup,
  login,
};
