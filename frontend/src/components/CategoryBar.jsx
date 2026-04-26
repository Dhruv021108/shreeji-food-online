import { Utensils } from "lucide-react";

export default function CategoryBar({ categories }) {
  return <section className="border-y border-orange-100 bg-orange-50/70"><div className="mx-auto flex max-w-7xl gap-3 overflow-x-auto px-4 py-5">{categories.map((c) => <a href="#menu" key={c._id} className="flex shrink-0 items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold shadow-sm hover:text-saffron"><Utensils className="h-4 w-4 text-chutney" />{c.name}</a>)}</div></section>;
}
