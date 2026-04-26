import { motion } from "framer-motion";
import { ArrowRight, Clock, ShieldCheck, Sparkles, Star } from "lucide-react";
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
  return <section className="relative overflow-hidden bg-royal text-white"><div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(216,168,74,.28),transparent_28rem),radial-gradient(circle_at_80%_20%,rgba(185,28,28,.22),transparent_26rem)]" /><div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-pearl to-transparent" /><div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-[1fr_.92fr] md:py-24"><motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col justify-center"><div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-gold/30 bg-white/10 px-4 py-2 text-sm font-black text-gold backdrop-blur"><Sparkles className="h-4 w-4" /> Private-kitchen freshness, online</div><EditableText as="h1" contentKey="heroTitle" value={content.heroTitle || "Shreeji Food Online"} className="max-w-3xl text-5xl font-black leading-[0.95] tracking-normal text-white md:text-7xl" /><EditableText as="p" contentKey="heroSubtitle" value={content.heroSubtitle || "Fresh Indian favourites delivered hot."} className="mt-6 max-w-2xl text-lg leading-8 text-white/72" /><div className="mt-8 flex flex-wrap gap-3"><a href="#menu" className="btn-primary">Reserve Your Order <ArrowRight className="h-4 w-4" /></a><a href="#menu" className="btn-secondary">Explore Menu</a></div><div className="mt-9 grid max-w-2xl gap-3 sm:grid-cols-3"><HeroStat icon={Star} label="Signature taste" value="4.8 rated" /><HeroStat icon={Clock} label="Express kitchen" value="30 min" /><HeroStat icon={ShieldCheck} label="UPI checkout" value="Secure" /></div></motion.div><motion.div initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} className="relative"><div className="absolute -inset-4 rounded-[2.5rem] border border-gold/20 bg-gold/10 blur-sm" /><img onDoubleClick={updateImage} className={`relative h-[380px] w-full rounded-[2rem] border border-gold/30 object-cover shadow-royal md:h-[560px] ${isOwner ? "cursor-pointer outline-dashed outline-2 outline-transparent hover:outline-gold" : ""}`} src={content.heroImage || "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1200&q=80"} alt="Indian food spread" /><div className="absolute bottom-5 left-5 rounded-3xl border border-gold/30 bg-royal/80 p-5 shadow-royal backdrop-blur"><p className="text-sm font-bold text-gold">Chef's promise</p><p className="text-2xl font-black text-white">Fresh from flame</p></div></motion.div></div></section>;
}

function HeroStat({ icon: Icon, label, value }) {
  return <div className="rounded-2xl border border-gold/20 bg-white/10 p-4 backdrop-blur"><Icon className="mb-3 h-5 w-5 text-gold" /><p className="text-xs font-black uppercase tracking-widest text-white/45">{label}</p><p className="mt-1 font-black text-white">{value}</p></div>;
}
