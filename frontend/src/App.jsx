import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "./api/axios";
import { useAuth } from "./context/AuthContext";
import { useSocket } from "./context/SocketContext";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import CategoryBar from "./components/CategoryBar";
import MenuSection from "./components/MenuSection";
import Offers from "./components/Offers";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import Checkout from "./components/Checkout";
import OwnerDashboard from "./components/OwnerDashboard";
import OrderTracker from "./components/OrderTracker";
import { fallbackCategories, fallbackContent, fallbackMenu } from "./data/fallbackData";

function Home({ data, setData }) {
  return <><Hero content={data.content} /><CategoryBar categories={data.categories} /><MenuSection menu={data.menu} categories={data.categories} setData={setData} /><Offers content={data.content} /><Contact content={data.content} /><Footer /></>;
}

export default function App() {
  const { isOwner } = useAuth();
  const { socket } = useSocket();
  const [data, setData] = useState({ menu: [], categories: [], content: {} });
  const load = async () => {
    try {
      const [menu, categories, content] = await Promise.all([api.get("/api/menu"), api.get("/api/categories"), api.get("/api/content")]);
      setData({ menu: menu.data, categories: categories.data, content: content.data });
    } catch {
      setData({ menu: fallbackMenu, categories: fallbackCategories, content: fallbackContent });
    }
  };
  useEffect(() => { load(); }, []);
  useEffect(() => {
    if (!socket) return;
    socket.on("menu:updated", load);
    socket.on("content:updated", ({ key, value }) => setData((d) => ({ ...d, content: { ...d.content, [key]: value } })));
    return () => { socket.off("menu:updated", load); socket.off("content:updated"); };
  }, [socket]);
  return <div className="min-h-screen text-ink"><Navbar /><main><Routes><Route path="/" element={<Home data={data} setData={setData} />} /><Route path="/checkout" element={<Checkout />} /><Route path="/orders" element={<OrderTracker />} /><Route path="/owner" element={isOwner ? <OwnerDashboard data={data} reload={load} /> : <Navigate to="/" />} /></Routes></main><CartDrawer /></div>;
}
