const prisma = require("../prisma/prisma");
const hashSync = require("bcrypt").hashSync;

const signup = async (req, res) => {
  const { username, email, password } = req.body;

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ username: username }, { email: email }],
    },
  });

  if (existingUser) {
    return res.status(400).json({ error: "Username or email already exists" });
  }

  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashSync(password, 10),
    },
  });
  res.status(201).json(user);
};





module.exports = {
  signup,
};
