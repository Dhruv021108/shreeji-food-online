import "dotenv/config";
import { makeId, now, replaceCollection } from "./config/githubDb.js";

const images = {
  pizza: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=80",
  burger: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80",
  dosa: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=900&q=80",
  thali: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=80",
  drink: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?auto=format&fit=crop&w=900&q=80"
};

const cats = ["Pizza","Burger","Chinese","South Indian","Snacks","Drinks","Desserts","Thali"].map((name, i) => ({ _id: makeId(), name, slug: name.toLowerCase().replace(/\s+/g, "-"), sortOrder: i, isActive: true, createdAt: now(), updatedAt: now() }));
const cat = (name) => cats.find((c) => c.name === name);
const menu = [
  { name: "Paneer Tikka Pizza", description: "Smoky paneer, peppers and melting cheese on a crisp base.", price: 249, category: cat("Pizza")._id, categoryName: "Pizza", image: images.pizza, isFeatured: true },
  { name: "Masala Cheese Burger", description: "Spiced aloo patty, cheese, crunchy onions and house chutney.", price: 149, category: cat("Burger")._id, categoryName: "Burger", image: images.burger },
  { name: "Mysore Masala Dosa", description: "Golden dosa with spicy chutney, potato masala and sambar.", price: 169, category: cat("South Indian")._id, categoryName: "South Indian", image: images.dosa, isFeatured: true },
  { name: "Veg Hakka Noodles", description: "Wok tossed noodles with vegetables and Indo-Chinese sauces.", price: 179, category: cat("Chinese")._id, categoryName: "Chinese", image: images.thali },
  { name: "Gujarati Mini Thali", description: "Roti, dal, sabzi, rice, farsan and sweet in one happy plate.", price: 229, category: cat("Thali")._id, categoryName: "Thali", image: images.thali, isFeatured: true },
  { name: "Fresh Lime Soda", description: "Sweet, salted or mixed, chilled and bright.", price: 79, category: cat("Drinks")._id, categoryName: "Drinks", image: images.drink }
].map((item) => ({ _id: makeId(), foodType: "veg", rating: 4.6, isAvailable: true, createdAt: now(), updatedAt: now(), ...item }));

const content = [
  { key: "heroTitle", value: "Shreeji Food Online" },
  { key: "heroSubtitle", value: "Fresh vegetarian favourites, fast delivery, and homestyle Indian comfort in every order." },
  { key: "heroImage", value: images.thali },
  { key: "offerTitle", value: "Flat 10% off with SHREEJI10" },
  { key: "offerSubtitle", value: "Use the coupon at checkout on your next family feast." },
  { key: "contactPhone", value: "+91 7021157367" },
  { key: "contactAddress", value: "Mumbai, Maharashtra" },
  { key: "openingHours", value: "Open daily 10:00 AM - 11:00 PM" }
].map((row) => ({ _id: makeId(), createdAt: now(), updatedAt: now(), ...row }));

await replaceCollection("categories", cats);
await replaceCollection("menu", menu);
await replaceCollection("content", content);
await replaceCollection("orders", []);
await replaceCollection("payments", []);

console.log("Seed complete");
process.exit(0);
