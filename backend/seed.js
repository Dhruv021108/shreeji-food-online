import "dotenv/config";
import { makeId, now, replaceCollection } from "./config/githubDb.js";

const images = {
  pizza: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=80",
  burger: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80",
  dosa: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=900&q=80",
  thali: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=80",
  noodles: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=900&q=80",
  samosa: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80",
  paneer: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=900&q=80",
  pav: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=900&q=80",
  drink: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?auto=format&fit=crop&w=900&q=80",
  dessert: "https://images.unsplash.com/photo-1605197183305-f8c0844623f2?auto=format&fit=crop&w=900&q=80",
  pasta: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=900&q=80",
  sandwich: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=80"
};

const cats = ["Pizza","Burger","Chinese","South Indian","Snacks","Drinks","Desserts","Thali"].map((name, i) => ({ _id: makeId(), name, slug: name.toLowerCase().replace(/\s+/g, "-"), sortOrder: i, isActive: true, createdAt: now(), updatedAt: now() }));
const cat = (name) => cats.find((c) => c.name === name);
const menu = [
  ["Royal Paneer Tikka Pizza", "Smoky paneer, roasted peppers, makhani drizzle and molten cheese.", 289, "Pizza", images.pizza, true, 4.9],
  ["Truffle Corn Cheese Pizza", "Sweet corn, jalapeno, mozzarella and a light truffle-style finish.", 259, "Pizza", images.pizza, false, 4.7],
  ["Mumbai Masala Burger", "Crisp aloo patty, cheese, onion crunch and house chutney.", 169, "Burger", images.burger, true, 4.8],
  ["Paneer Maharaja Burger", "Grilled paneer slab, creamy tandoori sauce and premium bun.", 219, "Burger", images.burger, true, 4.9],
  ["Mysore Masala Dosa", "Golden dosa with red chutney, potato masala, sambar and coconut chutney.", 179, "South Indian", images.dosa, true, 4.8],
  ["Ghee Roast Dosa", "Paper crisp dosa finished with ghee and served with classic sides.", 199, "South Indian", images.dosa, false, 4.7],
  ["Idli Sambar Platter", "Soft steamed idlis with hot sambar and coconut chutney.", 129, "South Indian", images.dosa, false, 4.6],
  ["Veg Hakka Noodles", "Wok-tossed noodles with vegetables and Indo-Chinese sauces.", 189, "Chinese", images.noodles, true, 4.7],
  ["Schezwan Fried Rice", "Fragrant rice tossed on high flame with bold Schezwan heat.", 199, "Chinese", images.noodles, false, 4.6],
  ["Chilli Paneer Dry", "Crisp paneer cubes, peppers, onion and glossy chilli garlic sauce.", 239, "Chinese", images.paneer, true, 4.8],
  ["Gujarati Mini Thali", "Roti, dal, sabzi, rice, farsan and sweet in one polished plate.", 249, "Thali", images.thali, true, 4.9],
  ["Deluxe Shreeji Thali", "A fuller feast with two sabzis, dal, rice, roti, farsan, pickle and dessert.", 349, "Thali", images.thali, true, 4.9],
  ["Paneer Butter Masala Bowl", "Creamy tomato gravy, soft paneer and jeera rice.", 269, "Thali", images.paneer, true, 4.8],
  ["Samosa Chaat", "Crushed samosa, chole, yogurt, chutneys and sev.", 139, "Snacks", images.samosa, true, 4.7],
  ["Pav Bhaji Royale", "Butter-loaded bhaji with toasted pav and fresh onions.", 179, "Snacks", images.pav, true, 4.8],
  ["Cheese Vada Pav Sliders", "Mini vada pavs with cheese, garlic chutney and fried chilli.", 149, "Snacks", images.pav, false, 4.6],
  ["Tandoori Paneer Skewers", "Charred paneer skewers with mint chutney and salad.", 249, "Snacks", images.paneer, true, 4.8],
  ["Cold Coffee Float", "Chilled coffee, vanilla scoop and chocolate finish.", 129, "Drinks", images.drink, false, 4.6],
  ["Mango Lassi", "Thick yogurt mango blend with saffron-style sweetness.", 119, "Drinks", images.drink, true, 4.8],
  ["Fresh Lime Soda", "Sweet, salted or mixed, chilled and bright.", 89, "Drinks", images.drink, false, 4.6],
  ["Gulab Jamun Sundae", "Warm gulab jamun with vanilla cream and pistachio dust.", 149, "Desserts", images.dessert, true, 4.9],
  ["Chocolate Brownie Sizzler", "Hot brownie, vanilla scoop and chocolate sauce.", 189, "Desserts", images.dessert, true, 4.8],
  ["Kesar Rabdi Cup", "Slow-cooked rabdi with saffron aroma and nuts.", 169, "Desserts", images.dessert, false, 4.7],
  ["Creamy Alfredo Pasta", "Silky white sauce pasta with herbs and vegetables.", 229, "Snacks", images.pasta, false, 4.6],
  ["Bombay Grill Sandwich", "Layered vegetable sandwich with chutney, cheese and grill marks.", 159, "Snacks", images.sandwich, false, 4.7]
].map(([name, description, price, categoryName, image, isFeatured, rating]) => ({ _id: makeId(), name, description, price, category: cat(categoryName)._id, categoryName, image, foodType: "veg", rating, isAvailable: true, isFeatured, createdAt: now(), updatedAt: now() }));

const content = [
  { key: "heroTitle", value: "Shreeji Food Online" },
  { key: "heroSubtitle", value: "A premium Indian ordering experience with rich vegetarian plates, polished service, live menu updates and UPI checkout." },
  { key: "heroImage", value: images.thali },
  { key: "offerTitle", value: "Flat 10% off with SHREEJI10" },
  { key: "offerSubtitle", value: "Use the coupon at checkout on signature thalis, pizzas, snacks and desserts." },
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
