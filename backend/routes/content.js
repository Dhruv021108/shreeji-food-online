import express from "express";
import { all, contentObject, create, upsertBy } from "../config/githubDb.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { ownerOnly } from "../middleware/ownerOnly.js";

const router = express.Router();

router.get("/", async (_req, res) => res.json(await contentObject()));

router.put("/:key", authMiddleware, ownerOnly, async (req, res) => {
  const doc = await upsertBy("content", (row) => row.key === req.params.key, { key: req.params.key }, { value: req.body.value });
  req.app.get("io").emit("content:updated", { key: doc.key, value: doc.value });
  res.json(doc);
});

export default router;
