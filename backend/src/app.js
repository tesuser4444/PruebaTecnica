import express from "express";
import cors from "cors";
import 'dotenv/config';
import { PrismaClient } from "@prisma/client";
import login from "./controllers/loginController";
import register from "./controllers/registerController";

const app = express();
const prisma = new PrismaClient();
const PORT = 5000;
const SECRET_KEY = "supersecretkey";

app.use(cors());
app.use(express.json());

app.use("/register", register);
app.use("/login", login);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
export { app, prisma, SECRET_KEY };