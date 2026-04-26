import EditableText from "./EditableText";

export default function Offers({ content }) {
  return <section id="offers" className="bg-masala py-14 text-white"><div className="mx-auto grid max-w-7xl gap-6 px-4 md:grid-cols-3"><div className="md:col-span-2"><p className="font-bold text-orange-200">Today’s offer</p><EditableText as="h2" contentKey="offerTitle" value={content.offerTitle || "Flat 10% off with SHREEJI10"} className="mt-2 text-4xl font-black" /><EditableText as="p" contentKey="offerSubtitle" value={content.offerSubtitle || "Use coupon at checkout."} className="mt-3 max-w-2xl text-lg text-orange-100" /></div><div className="rounded-3xl bg-white p-6 text-ink"><p className="text-sm font-black text-gray-400">Combo pick</p><h3 className="mt-2 text-2xl font-black">Family Feast Box</h3><p className="mt-2 text-gray-600">Pizza, thali, noodles, dessert and drinks for a complete dinner table.</p></div></div></section>;
}
