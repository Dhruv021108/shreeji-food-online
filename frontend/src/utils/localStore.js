const ORDERS_KEY = "sfo_orders";
const USER_KEY = "sfo_user";
const OWNER_PHONE = "7021157367";
const UPI_ID = "7021157367@upi";

export const cleanPhone = (phone = "") => String(phone).replace(/\D/g, "").slice(-10);

export function makeLocalUser(phone) {
  const clean = cleanPhone(phone);
  return { _id: `local-user-${clean}`, phone: clean, name: "", role: clean === OWNER_PHONE ? "owner" : "customer" };
}

export function saveLocalUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem("sfo_token", `local-${user.phone}`);
}

export function getLocalUser() {
  try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch { return null; }
}

export function clearLocalUser() {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem("sfo_token");
}

export function getLocalOrders() {
  try { return JSON.parse(localStorage.getItem(ORDERS_KEY)) || []; } catch { return []; }
}

export function saveLocalOrders(orders) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  window.dispatchEvent(new Event("sfo:ordersChanged"));
}

export function createLocalOrder({ user, form, items, totals, coupon }) {
  const order = {
    _id: `order-${Date.now()}`,
    user: user._id,
    customerName: form.customerName,
    phone: form.phone || user.phone,
    address: form.address,
    notes: form.notes || "",
    items,
    coupon,
    subtotal: totals.subtotal,
    deliveryFee: totals.deliveryFee,
    tax: totals.tax,
    discount: totals.discount,
    total: totals.total,
    status: "Pending",
    paymentStatus: "pending",
    paymentId: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  saveLocalOrders([order, ...getLocalOrders()]);
  return order;
}

export function updateLocalOrder(id, patch) {
  const orders = getLocalOrders().map((order) => order._id === id ? { ...order, ...patch, updatedAt: new Date().toISOString() } : order);
  saveLocalOrders(orders);
  return orders.find((order) => order._id === id);
}

export function localUpiPayment(order) {
  const pa = encodeURIComponent(UPI_ID);
  const pn = encodeURIComponent("Shreeji Food Online");
  const tn = encodeURIComponent(`Shreeji Food Online order ${order._id}`);
  return { order, upiId: UPI_ID, amount: order.total, upiLink: `upi://pay?pa=${pa}&pn=${pn}&am=${Number(order.total).toFixed(2)}&cu=INR&tn=${tn}` };
}
