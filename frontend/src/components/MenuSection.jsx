import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import MenuCard from "./MenuCard";

export default function MenuSection({ menu, categories, setData }) {
  const { isOwner } = useAuth();
  const [active, setActive] = useState("All");
  const filtered = useMemo(() => active === "All" ? menu : menu.filter((m) => m.categoryName === active || m.category?.name === active), [menu, active]);
  const reload = async () => {
    const [m, c] = await Promise.all([api.get("/api/menu"), api.get("/api/categories")]);
    setData((d) => ({ ...d, menu: m.data, categories: c.data }));
  };
  const addItem = async () => {
    const c = categories[0];
    await api.post("/api/menu", { name: "New Dish", description: "Double-click fields to edit this item.", price: 99, category: c?._id, categoryName: c?.name, image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80" });
    reload();
  };
  return <section id="menu" className="mx-auto max-w-7xl px-4 py-16"><div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="section-kicker">Curated online dining</p><h2 className="section-title">A menu made to feel expensive</h2><p className="mt-3 max-w-2xl text-gray-600">Signature comfort plates, precise live pricing, and a polished ordering flow for every guest.</p></div>{isOwner && <button onClick={addItem} className="btn-primary"><Plus className="h-4 w-4" /> Add menu item</button>}</div><div className="mb-9 flex gap-2 overflow-x-auto rounded-full border border-gold/20 bg-white/60 p-2 shadow-sm backdrop-blur"><button onClick={() => setActive("All")} className={`chip ${active === "All" ? "chip-active" : ""}`}>All</button>{categories.map((c) => <button key={c._id} onClick={() => setActive(c.name)} className={`chip ${active === c.name ? "chip-active" : ""}`}>{c.name}</button>)}</div><div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((item) => <MenuCard key={item._id} item={item} categories={categories} reload={reload} />)}</div></section>;
}
