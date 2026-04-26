const img = {
  pizza: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=80",
  burger: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80",
  dosa: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=900&q=80",
  thali: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=80",
  noodles: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=900&q=80",
  samosa: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80",
  paneer: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=900&q=80",
  pav: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=900&q=80",
  lassi: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?auto=format&fit=crop&w=900&q=80",
  dessert: "https://images.unsplash.com/photo-1605197183305-f8c0844623f2?auto=format&fit=crop&w=900&q=80",
  pasta: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=900&q=80",
  sandwich: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=80"
};

export const fallbackCategories = ["Pizza", "Burger", "Chinese", "South Indian", "Snacks", "Drinks", "Desserts", "Thali"].map((name, index) => ({
  _id: `cat-${index + 1}`,
  name,
  slug: name.toLowerCase().replace(/\s+/g, "-"),
  isActive: true,
  sortOrder: index
}));

const categoryId = (name) => fallbackCategories.find((c) => c.name === name)?._id;

export const fallbackMenu = [
  ["Royal Paneer Tikka Pizza", "Smoky paneer, roasted peppers, makhani drizzle and molten cheese.", 289, "Pizza", img.pizza, true, 4.9],
  ["Truffle Corn Cheese Pizza", "Sweet corn, jalapeno, mozzarella and a light truffle-style finish.", 259, "Pizza", img.pizza, false, 4.7],
  ["Mumbai Masala Burger", "Crisp aloo patty, cheese, onion crunch and house chutney.", 169, "Burger", img.burger, true, 4.8],
  ["Paneer Maharaja Burger", "Grilled paneer slab, creamy tandoori sauce and premium bun.", 219, "Burger", img.burger, true, 4.9],
  ["Mysore Masala Dosa", "Golden dosa with red chutney, potato masala, sambar and coconut chutney.", 179, "South Indian", img.dosa, true, 4.8],
  ["Ghee Roast Dosa", "Paper crisp dosa finished with ghee and served with classic sides.", 199, "South Indian", img.dosa, false, 4.7],
  ["Idli Sambar Platter", "Soft steamed idlis with hot sambar and coconut chutney.", 129, "South Indian", img.dosa, false, 4.6],
  ["Veg Hakka Noodles", "Wok-tossed noodles with vegetables and Indo-Chinese sauces.", 189, "Chinese", img.noodles, true, 4.7],
  ["Schezwan Fried Rice", "Fragrant rice tossed on high flame with bold Schezwan heat.", 199, "Chinese", img.noodles, false, 4.6],
  ["Chilli Paneer Dry", "Crisp paneer cubes, peppers, onion and glossy chilli garlic sauce.", 239, "Chinese", img.paneer, true, 4.8],
  ["Gujarati Mini Thali", "Roti, dal, sabzi, rice, farsan and sweet in one polished plate.", 249, "Thali", img.thali, true, 4.9],
  ["Deluxe Shreeji Thali", "A fuller feast with two sabzis, dal, rice, roti, farsan, pickle and dessert.", 349, "Thali", img.thali, true, 4.9],
  ["Paneer Butter Masala Bowl", "Creamy tomato gravy, soft paneer and jeera rice.", 269, "Thali", img.paneer, true, 4.8],
  ["Samosa Chaat", "Crushed samosa, chole, yogurt, chutneys and sev.", 139, "Snacks", img.samosa, true, 4.7],
  ["Pav Bhaji Royale", "Butter-loaded bhaji with toasted pav and fresh onions.", 179, "Snacks", img.pav, true, 4.8],
  ["Cheese Vada Pav Sliders", "Mini vada pavs with cheese, garlic chutney and fried chilli.", 149, "Snacks", img.pav, false, 4.6],
  ["Tandoori Paneer Skewers", "Charred paneer skewers with mint chutney and salad.", 249, "Snacks", img.paneer, true, 4.8],
  ["Cold Coffee Float", "Chilled coffee, vanilla scoop and chocolate finish.", 129, "Drinks", img.lassi, false, 4.6],
  ["Mango Lassi", "Thick yogurt mango blend with saffron-style sweetness.", 119, "Drinks", img.lassi, true, 4.8],
  ["Fresh Lime Soda", "Sweet, salted or mixed, chilled and bright.", 89, "Drinks", img.lassi, false, 4.6],
  ["Gulab Jamun Sundae", "Warm gulab jamun with vanilla cream and pistachio dust.", 149, "Desserts", img.dessert, true, 4.9],
  ["Chocolate Brownie Sizzler", "Hot brownie, vanilla scoop and chocolate sauce.", 189, "Desserts", img.dessert, true, 4.8],
  ["Kesar Rabdi Cup", "Slow-cooked rabdi with saffron aroma and nuts.", 169, "Desserts", img.dessert, false, 4.7],
  ["Creamy Alfredo Pasta", "Silky white sauce pasta with herbs and vegetables.", 229, "Snacks", img.pasta, false, 4.6],
  ["Bombay Grill Sandwich", "Layered vegetable sandwich with chutney, cheese and grill marks.", 159, "Snacks", img.sandwich, false, 4.7]
].map(([name, description, price, categoryName, image, isFeatured, rating], index) => ({
  _id: `menu-${index + 1}`,
  name,
  description,
  price,
  category: categoryId(categoryName),
  categoryName,
  image,
  foodType: "veg",
  rating,
  isAvailable: true,
  isFeatured
}));

export const fallbackContent = {
  heroTitle: "Shreeji Food Online",
  heroSubtitle: "A premium Indian ordering experience with rich vegetarian plates, polished service, live menu updates and UPI checkout.",
  heroImage: img.thali,
  offerTitle: "Flat 10% off with SHREEJI10",
  offerSubtitle: "Use the coupon at checkout on signature thalis, pizzas, snacks and desserts.",
  contactPhone: "+91 7021157367",
  contactAddress: "Mumbai, Maharashtra",
  openingHours: "Open daily 10:00 AM - 11:00 PM"
};
