import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Checkout() {
  const { user, loginPhone } = useAuth();
  const cart = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ customerName: "", phone: user?.phone || "", address: "", notes: "" });
  const [upi, setUpi] = useState(null);
  const [reference, setReference] = useState("");
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const createUpiPayment = async (e) => {
    e.preventDefault();
    if (!user) await loginPhone(form.phone);
    const items = cart.items.map((x) => ({ menuItem: x._id, name: x.name, price: x.price, quantity: x.quantity, image: x.image }));
    const orderRes = await api.post("/api/orders", { ...form, coupon: cart.coupon, items });
    const upiRes = await api.post("/api/payment/create-upi", { orderId: orderRes.data._id });
    setUpi(upiRes.data);
    window.location.href = upiRes.data.upiLink;
    toast.success("UPI app opened. Enter UTR after payment.");
  };
  const confirmPayment = async () => {
    await api.post("/api/payment/confirm", { orderId: upi.order._id, reference });
    toast.success("Payment reference submitted");
    cart.clear();
    navigate("/orders");
  };
  return <section className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-[1fr_380px]"><div className="rounded-3xl bg-white p-6 shadow-premium"><p className="section-kicker">UPI payment</p><h1 className="section-title mb-6">Checkout</h1>{!upi ? <form onSubmit={createUpiPayment} className="grid gap-4"><input required className="field" placeholder="Customer name" value={form.customerName} onChange={(e) => set("customerName", e.target.value)} /><input required className="field" placeholder="Phone number" value={form.phone} onChange={(e) => set("phone", e.target.value)} /><textarea required className="field min-h-28" placeholder="Delivery address" value={form.address} onChange={(e) => set("address", e.target.value)} /><textarea className="field min-h-20" placeholder="Delivery notes" value={form.notes} onChange={(e) => set("notes", e.target.value)} /><button disabled={!cart.items.length} className="btn-primary justify-center disabled:opacity-50">Pay by UPI</button></form> : <div className="space-y-4"><div className="rounded-2xl bg-orange-50 p-4"><p className="text-sm font-bold text-gray-500">Payee UPI ID</p><p className="text-2xl font-black text-masala">{upi.upiId}</p><p className="mt-2 text-sm text-gray-600">Amount: ₹{upi.amount}</p></div><a className="btn-primary justify-center" href={upi.upiLink}>Open UPI App Again</a><input className="field" value={reference} onChange={(e) => setReference(e.target.value)} placeholder="Enter UPI UTR / reference number" /><button onClick={confirmPayment} className="btn-primary justify-center">Submit Payment Reference</button><p className="text-sm text-gray-500">Owner will verify the UPI reference and mark payment as paid from the dashboard.</p></div>}</div><aside className="h-fit rounded-3xl bg-white p-6 shadow-premium"><h2 className="text-xl font-black">Order Summary</h2><div className="mt-4 space-y-3">{cart.items.map((x) => <div key={x._id} className="flex justify-between text-sm"><span>{x.quantity} x {x.name}</span><b>₹{x.quantity * x.price}</b></div>)}</div><div className="mt-5 border-t pt-4 text-2xl font-black">₹{cart.total}</div></aside></section>;
}
