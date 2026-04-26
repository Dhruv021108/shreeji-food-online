import { Link, NavLink } from "react-router-dom";
import { LogOut, Menu, ShoppingCart, UserRound } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, isOwner, loginPhone, logout } = useAuth();
  const { items, setOpen } = useCart();
  const [phone, setPhone] = useState("");
  const [mobile, setMobile] = useState(false);
  const links = [["/", "Home"], ["/#menu", "Menu"], ["/#offers", "Offers"], ["/#contact", "Contact"], ["/orders", "Orders"]];
  const submit = (e) => { e.preventDefault(); if (phone) loginPhone(phone); };
  return <header className="sticky top-0 z-40 border-b border-orange-100 bg-white/90 backdrop-blur-xl"><div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3"><Link to="/" className="text-xl font-black text-masala">Shreeji <span className="text-saffron">Food</span></Link><nav className="hidden items-center gap-6 text-sm font-semibold md:flex">{links.map(([to, label]) => <NavLink key={label} to={to} className="hover:text-saffron">{label}</NavLink>)}{isOwner && <Link className="rounded-full bg-ink px-4 py-2 text-white" to="/owner">Owner Dashboard</Link>}</nav><div className="hidden items-center gap-2 md:flex">{user ? <><span className="rounded-full bg-orange-50 px-3 py-2 text-sm"><UserRound className="mr-1 inline h-4 w-4" />{user.phone}</span><button onClick={logout} className="icon-btn"><LogOut /></button></> : <form onSubmit={submit} className="flex rounded-full border border-orange-200 bg-white p-1"><input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone login" className="w-32 bg-transparent px-3 text-sm outline-none" /><button className="rounded-full bg-saffron px-4 py-2 text-sm font-bold text-white">Login</button></form>}<button onClick={() => setOpen(true)} className="relative icon-btn"><ShoppingCart />{items.length > 0 && <b className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-masala text-xs text-white">{items.length}</b>}</button></div><button className="icon-btn md:hidden" onClick={() => setMobile(!mobile)}><Menu /></button></div>{mobile && <div className="space-y-3 border-t bg-white px-4 py-4 md:hidden">{links.map(([to, label]) => <Link key={label} onClick={() => setMobile(false)} to={to} className="block font-semibold">{label}</Link>)}{isOwner && <Link to="/owner" className="block font-semibold">Owner Dashboard</Link>}<form onSubmit={submit} className="flex gap-2"><input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" className="min-w-0 flex-1 rounded-xl border px-3 py-2" />{user ? <button type="button" onClick={logout} className="btn-secondary">Logout</button> : <button className="btn-primary">Login</button>}</form><button onClick={() => setOpen(true)} className="btn-primary w-full">Cart ({items.length})</button></div>}</header>;
}
