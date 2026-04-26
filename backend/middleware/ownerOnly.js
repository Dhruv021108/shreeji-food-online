export const ownerOnly = (req, res, next) => {
  const ownerPhone = process.env.OWNER_PHONE || "7021157367";
  if (req.user?.role === "owner" && req.user?.phone === ownerPhone) return next();
  return res.status(403).json({ message: "Owner access required" });
};
