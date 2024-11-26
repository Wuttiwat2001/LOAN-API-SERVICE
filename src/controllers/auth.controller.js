const prisma = require("../prisma/prisma");
const hashSync = require("bcrypt").hashSync;
const compareSync = require("bcrypt").compareSync;
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../secrets");

const signup = async (req, res, next) => {
  try {
    const { username, email, password, firstName, lastName, phone, prefix } =
      req.body;
    const fullName = `${firstName} ${lastName}`;

    const existingUsername = await prisma.user.findFirst({
      where: { username: username },
    });
    if (existingUsername) {
      return res.status(400).json({ error: "รหัสผู้ใช้งานนี้ถูกใช้แล้ว" });
    }

    const existingEmail = await prisma.user.findFirst({
      where: { email: email },
    });
    if (existingEmail) {
      return res.status(400).json({ error: "อีเมลนี้ถูกใช้แล้ว" });
    }

    const existingPhone = await prisma.user.findFirst({
      where: { phone: phone },
    });
    if (existingPhone) {
      return res.status(400).json({ error: "หมายเลขโทรศัพท์นี้ถูกใช้แล้ว" });
    }

    const fullPhoneNumber = prefix + phone;

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashSync(password, 10),
        firstName,
        lastName,
        fullName,
        phone: fullPhoneNumber,
        balance: 1000,
      },
    });

    res.status(201).json({
      data: {
        message: "SUCCESS",
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        username: username,
      },
    });

    if (!user || !compareSync(password, user.password)) {
      return res
        .status(400)
        .json({ error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      data: {
        message: "SUCCESS",
        user,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
};
