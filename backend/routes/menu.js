import express from "express";
import { all, create, removeById, updateById } from "../config/githubDb.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { ownerOnly } from "../middleware/ownerOnly.js";

const router = express.Router();

router.get("/", async (_req, res) => res.json((await all("menu")).sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured) || a.name.localeCompare(b.name))));

router.post("/", authMiddleware, ownerOnly, async (req, res) => {
  const item = await create("menu", req.body);
  req.app.get("io").emit("menu:updated", { type: "created", item });
  res.status(201).json(item);
});

router.put("/:id", authMiddleware, ownerOnly, async (req, res) => {
  const item = await updateById("menu", req.params.id, req.body);
  if (!item) return res.status(404).json({ message: "Item not found" });
  req.app.get("io").emit("menu:updated", { type: "updated", item });
  res.json(item);
});

router.delete("/:id", authMiddleware, ownerOnly, async (req, res) => {
  await removeById("menu", req.params.id);
  req.app.get("io").emit("menu:updated", { type: "deleted", id: req.params.id });
  res.json({ ok: true });
});

export default router;
