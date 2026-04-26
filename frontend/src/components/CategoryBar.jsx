import { Utensils } from "lucide-react";

export default function CategoryBar({ categories }) {
  return <section className="border-y border-gold/20 bg-pearl/90"><div className="mx-auto flex max-w-7xl gap-3 overflow-x-auto px-4 py-6">{categories.map((c) => <a href="#menu" key={c._id} className="group flex shrink-0 items-center gap-3 rounded-full border border-gold/20 bg-white/80 px-5 py-3 text-sm font-black shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-gold hover:shadow-glow"><span className="grid h-8 w-8 place-items-center rounded-full bg-royal text-gold transition group-hover:bg-gold group-hover:text-royal"><Utensils className="h-4 w-4" /></span>{c.name}</a>)}</div></section>;
}
