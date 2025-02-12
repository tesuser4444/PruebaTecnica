import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma, SECRET_KEY } from "../app.js";
import {loginSchema} from "../validators/loginSchema.js";

export default async function login(req, res) {
  try{
    const validateData = loginSchema.parse(req.body);

    const { email, password, } = validateData;
    const user = await prisma.user.findUnique({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: "1h" });
      return res.json({ token, message: "Login successful" });	
    } else{
      return res.status(400).json({ error: { message: "Invalid email or password" }});
    }
  }catch(error){
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    return res.status(400).json({ error: "User already exists" });
  }

  
}