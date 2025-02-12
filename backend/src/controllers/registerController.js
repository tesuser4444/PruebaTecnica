import bcrypt from "bcryptjs";
import { prisma, app } from "../app.js";
import {registerSchema} from "../validators/registerSchema.js";
import { z } from "zod";

export default async function register(req, res) {

  try {
    const validateData = registerSchema.parse(req.body);

    const { email, password, name } = validateData;
    
    const hashedPassword =  await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name },
    });
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    return res.status(400).json({ error: "User already exists" });
  }
}
