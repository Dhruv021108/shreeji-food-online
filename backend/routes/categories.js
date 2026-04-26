import express from "express";
import { all, create, removeById, updateById } from "../config/githubDb.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { ownerOnly } from "../middleware/ownerOnly.js";

const router = express.Router();
const slugify = (v = "") => v.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

router.get("/", async (_req, res) => res.json((await all("categories")).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0) || a.name.localeCompare(b.name))));
router.post("/", authMiddleware, ownerOnly, async (req, res) => {
  const category = await create("categories", { ...req.body, slug: req.body.slug || slugify(req.body.name), isActive: req.body.isActive ?? true });
  req.app.get("io").emit("menu:updated", { type: "category-created", category });
  res.status(201).json(category);
});
router.put("/:id", authMiddleware, ownerOnly, async (req, res) => {
  const update = { ...req.body };
  if (update.name && !update.slug) update.slug = slugify(update.name);
  const category = await updateById("categories", req.params.id, update);
  req.app.get("io").emit("menu:updated", { type: "category-updated", category });
  res.json(category);
});
router.delete("/:id", authMiddleware, ownerOnly, async (req, res) => {
  await removeById("categories", req.params.id);
  req.app.get("io").emit("menu:updated", { type: "category-deleted", id: req.params.id });
  res.json({ ok: true });
});

export default router;
