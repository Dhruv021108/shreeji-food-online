import express from "express";
import jwt from "jsonwebtoken";
import { upsertBy } from "../config/githubDb.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();
const cleanPhone = (phone = "") => String(phone).replace(/\D/g, "");

const tokenFor = (user) => jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "30d" });

router.post("/login-phone", async (req, res) => {
  const phone = cleanPhone(req.body.phone);
  if (phone.length < 10) return res.status(400).json({ message: "Valid phone number required" });
  const ownerPhone = process.env.OWNER_PHONE || "7021157367";
  const role = phone === ownerPhone ? "owner" : "customer";
  const user = await upsertBy("users", (u) => u.phone === phone, { phone, name: "", addresses: [] }, { role });
  res.json({ token: tokenFor(user), user });
});

router.get("/me", authMiddleware, (req, res) => res.json({ user: req.user }));

export default router;
