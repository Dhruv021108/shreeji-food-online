import express from "express";
import { create, findById, findOne, updateById } from "../config/githubDb.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();
const upiString = ({ amount, orderId }) => {
  const pa = encodeURIComponent(process.env.UPI_ID || "yourupi@bank");
  const pn = encodeURIComponent(process.env.UPI_PAYEE_NAME || "Shreeji Food Online");
  const tn = encodeURIComponent(`Shreeji Food Online order ${orderId}`);
  return `upi://pay?pa=${pa}&pn=${pn}&am=${Number(amount).toFixed(2)}&cu=INR&tn=${tn}`;
};

router.post("/create-upi", authMiddleware, async (req, res) => {
  const order = await findById("orders", req.body.orderId);
  if (!order || order.user !== req.user._id) return res.status(404).json({ message: "Order not found" });
  const payment = await create("payments", {
    order: order._id,
    user: req.user._id,
    amount: order.total,
    currency: "INR",
    method: "upi",
    upiId: process.env.UPI_ID || "yourupi@bank",
    upiLink: upiString({ amount: order.total, orderId: order._id }),
    status: "awaiting_confirmation",
    reference: ""
  });
  res.json({ payment, upiLink: payment.upiLink, upiId: payment.upiId, amount: order.total, order });
});

router.post("/confirm", authMiddleware, async (req, res) => {
  const order = await findById("orders", req.body.orderId);
  if (!order) return res.status(404).json({ message: "Order not found" });
  if (order.user !== req.user._id) return res.status(403).json({ message: "Cannot confirm another user's payment" });
  const reference = String(req.body.reference || "").trim();
  if (reference.length < 6) return res.status(400).json({ message: "Enter a valid UPI reference or UTR number" });
  const existing = await findOne("payments", (p) => p.order === order._id);
  const paymentPatch = { reference, status: "submitted", submittedAt: new Date().toISOString() };
  const payment = existing ? await updateById("payments", existing._id, paymentPatch) : await create("payments", { order: order._id, user: req.user._id, amount: order.total, currency: "INR", method: "upi", ...paymentPatch });
  const updatedOrder = await updateById("orders", order._id, { paymentStatus: "submitted", paymentId: reference });
  req.app.get("io").to("owners").emit("payment:success", { order: updatedOrder, payment });
  res.json({ ok: true, order: updatedOrder, payment });
});

router.post("/verify", authMiddleware, async (_req, res) => {
  res.status(410).json({ message: "Gateway verification is disabled. Use /api/payment/create-upi and /api/payment/confirm for UPI payments." });
});

export default router;
