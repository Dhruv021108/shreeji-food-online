import { createContext, useContext, useMemo, useState } from "react";
import toast from "react-hot-toast";

const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [open, setOpen] = useState(false);
  const add = (item) => {
    if (!item.isAvailable) return toast.error("This item is currently unavailable");
    setItems((prev) => prev.some((x) => x._id === item._id) ? prev.map((x) => x._id === item._id ? { ...x, quantity: x.quantity + 1 } : x) : [...prev, { ...item, quantity: 1 }]);
    toast.success(`${item.name} added`);
  };
  const inc = (id) => setItems((p) => p.map((x) => x._id === id ? { ...x, quantity: x.quantity + 1 } : x));
  const dec = (id) => setItems((p) => p.flatMap((x) => x._id === id ? (x.quantity > 1 ? [{ ...x, quantity: x.quantity - 1 }] : []) : [x]));
  const remove = (id) => setItems((p) => p.filter((x) => x._id !== id));
  const clear = () => { setItems([]); setCoupon(""); };
  const subtotal = items.reduce((s, x) => s + x.price * x.quantity, 0);
  const deliveryFee = subtotal > 499 || subtotal === 0 ? 0 : 30;
  const tax = Math.round(subtotal * 0.05);
  const discount = coupon.toUpperCase() === "SHREEJI10" ? Math.round(subtotal * 0.1) : 0;
  const total = Math.max(0, subtotal + deliveryFee + tax - discount);
  return <CartContext.Provider value={useMemo(() => ({ items, coupon, setCoupon, add, inc, dec, remove, clear, subtotal, deliveryFee, tax, discount, total, open, setOpen }), [items, coupon, subtotal, deliveryFee, tax, discount, total, open])}>{children}</CartContext.Provider>;
}
