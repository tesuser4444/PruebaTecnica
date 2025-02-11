import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma, SECRET_KEY } from "../app.js";

export default async function login(req, res) {
  const validateData = registerSchema.parse(req.body);

  const { email, password, name } = validateData;
  const user = await prisma.user.findUnique({ where: { email } });
  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ token });
  } else {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    return res.status(400).json({ error: "User already exists" });
  }
}