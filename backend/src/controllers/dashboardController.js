import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../app.js";

export default function dashboard(req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Access denied" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }
    res.json({ message: `Welcome, ${decoded.email}` });
  });
}
