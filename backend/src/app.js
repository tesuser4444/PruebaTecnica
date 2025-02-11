import express from "express";
import cors from "cors";
import 'dotenv/config';
import { PrismaClient } from "@prisma/client";
import loginController from "./controllers/loginController.js";
import register from "./controllers/registerController.js";
import dashboard from "./controllers/dashboardController.js";

const app = express();
const prisma = new PrismaClient();
const PORT = 5000;
const SECRET_KEY = "supersecretkey";

app.use(cors());
app.use(express.json());

// Ensure database connection
(async () => {
  try {
    await prisma.$connect();
    console.log("Connected to SQLite database");
  } catch (error) {
    console.error("Failed to connect to the database", error);
  }
})();

app.use("/login", loginController);
app.use("/register", register);
app.use("/dashboard", dashboard);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
export { app, prisma, SECRET_KEY };