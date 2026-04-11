const adminOnly = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "User not found" });

    if (!["admin", "super_admin"].includes(user.role)) {
      return res.status(403).json({ message: "Admin access required" });
    }

    req.adminUser = user;
    next();
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ── Only Super Admin can access ───────────────────────────
const superAdminOnly = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "User not found" });

    if (user.role !== "super_admin") {
      return res.status(403).json({ message: "Super Admin access required" });
    }

    req.adminUser = user;
    next();
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ── Manager and above ─────────────────────────────────────
const managerAndAbove = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "User not found" });

    const allowed = ["manager", "admin", "super_admin"];
    if (!allowed.includes(user.role)) {
      return res.status(403).json({ message: "Manager access required" });
    }

    req.adminUser = user;
    next();
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { adminOnly, superAdminOnly, managerAndAbove };