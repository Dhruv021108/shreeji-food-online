import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";

export default function OrderTracker() {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [orders, setOrders] = useState([]);
  const load = () => user && api.get("/api/orders/my").then((r) => setOrders(r.data));
  useEffect(() => { load(); }, [user]);
  useEffect(() => { if (!socket) return; socket.on("order:statusUpdated", load); return () => socket.off("order:statusUpdated", load); }, [socket, user]);
  if (!user) return <div className="mx-auto max-w-4xl px-4 py-16"><h1 className="section-title">Login to see orders</h1></div>;
  return <section className="mx-auto max-w-5xl px-4 py-12"><p className="section-kicker">Live tracking</p><h1 className="section-title mb-6">My Orders</h1><div className="space-y-4">{orders.map((o) => <article key={o._id} className="rounded-3xl bg-white p-5 shadow-sm"><div className="flex flex-wrap justify-between gap-3"><div><h2 className="font-black">Order #{o._id.slice(-6)}</h2><p className="text-sm text-gray-500">{new Date(o.createdAt).toLocaleString()}</p></div><div className="text-right"><p className="font-black text-masala">₹{o.total}</p><p className="text-sm font-bold text-chutney">{o.paymentStatus}</p></div></div><p className="mt-3 rounded-full bg-orange-50 px-4 py-2 text-sm font-black text-masala">{o.status}</p></article>)}</div></section>;
}
