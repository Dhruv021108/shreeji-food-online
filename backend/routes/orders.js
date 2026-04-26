import express from "express";
import { all, create, updateById } from "../config/githubDb.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { ownerOnly } from "../middleware/ownerOnly.js";

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  const items = Array.isArray(req.body.items) ? req.body.items : [];
  if (!items.length) return res.status(400).json({ message: "Cart is empty" });
  const subtotal = items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1), 0);
  const deliveryFee = subtotal > 499 ? 0 : 30;
  const tax = Math.round(subtotal * 0.05);
  const discount = String(req.body.coupon || "").toUpperCase() === "SHREEJI10" ? Math.round(subtotal * 0.1) : 0;
  const total = Math.max(0, subtotal + deliveryFee + tax - discount);
  const order = await create("orders", { ...req.body, user: req.user._id, phone: req.body.phone || req.user.phone, items, subtotal, deliveryFee, tax, discount, total, status: "Pending", paymentStatus: "pending", paymentId: "" });
  req.app.get("io").to("owners").emit("order:new", order);
  res.status(201).json(order);
});

router.get("/my", authMiddleware, async (req, res) => res.json((await all("orders")).filter((o) => o.user === req.user._id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))));
router.get("/all", authMiddleware, ownerOnly, async (_req, res) => res.json((await all("orders")).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))));

router.put("/:id/status", authMiddleware, ownerOnly, async (req, res) => {
  const order = await updateById("orders", req.params.id, { status: req.body.status });
  req.app.get("io").emit("order:statusUpdated", order);
  res.json(order);
});

router.put("/:id/payment-status", authMiddleware, ownerOnly, async (req, res) => {
  const order = await updateById("orders", req.params.id, { paymentStatus: req.body.paymentStatus, paymentId: req.body.paymentId || "" });
  req.app.get("io").emit("payment:success", { order });
  res.json(order);
});

export default router;
