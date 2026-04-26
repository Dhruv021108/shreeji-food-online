import "dotenv/config";
import cors from "cors";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import authRoutes from "./routes/auth.js";
import menuRoutes from "./routes/menu.js";
import categoryRoutes from "./routes/categories.js";
import orderRoutes from "./routes/orders.js";
import paymentRoutes from "./routes/payment.js";
import contentRoutes from "./routes/content.js";
import { registerSocketHandlers } from "./socket/socketHandler.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: process.env.CLIENT_URL || "http://localhost:5173", methods: ["GET", "POST", "PUT", "DELETE"] } });

app.set("io", io);
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json({ limit: "1mb" }));

app.get("/", (_req, res) => res.json({ name: "Shreeji Food Online API", ok: true }));
app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/content", contentRoutes);

registerSocketHandlers(io);

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`API running on ${port} with GitHub JSON database`));
