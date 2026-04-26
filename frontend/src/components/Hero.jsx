import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import EditableText from "./EditableText";

export default function Hero({ content }) {
  const { isOwner } = useAuth();
  const updateImage = async () => {
    if (!isOwner) return;
    const value = prompt("Hero image URL", content.heroImage || "");
    if (value) { await api.put("/api/content/heroImage", { value }); toast.success("Hero image updated"); }
  };
  return <section className="relative overflow-hidden bg-white"><div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-[1fr_.9fr] md:py-20"><motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col justify-center"><div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-sm font-bold text-masala"><Sparkles className="h-4 w-4" /> Live vegetarian kitchen</div><EditableText as="h1" contentKey="heroTitle" value={content.heroTitle || "Shreeji Food Online"} className="max-w-3xl text-5xl font-black leading-tight tracking-normal text-ink md:text-7xl" /><EditableText as="p" contentKey="heroSubtitle" value={content.heroSubtitle || "Fresh Indian favourites delivered hot."} className="mt-5 max-w-2xl text-lg leading-8 text-gray-600" /><div className="mt-8 flex flex-wrap gap-3"><a href="#menu" className="btn-primary">Order Now <ArrowRight className="h-4 w-4" /></a><a href="#menu" className="btn-secondary">View Menu</a></div></motion.div><motion.div initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} className="relative"><img onDoubleClick={updateImage} className={`h-[360px] w-full rounded-[2rem] object-cover shadow-premium md:h-[500px] ${isOwner ? "cursor-pointer outline-dashed outline-2 outline-transparent hover:outline-orange-300" : ""}`} src={content.heroImage || "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1200&q=80"} alt="Indian food spread" /><div className="absolute bottom-5 left-5 rounded-2xl bg-white/90 p-4 shadow-xl backdrop-blur"><p className="text-sm font-bold text-gray-500">Delivery from</p><p className="text-2xl font-black text-masala">30 min</p></div></motion.div></div></section>;
}
