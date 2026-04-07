const User = require("../models/User");
const bcrypt = require("bcryptjs");

// ══════════════════════════════════════════════
//  GET ALL USERS  →  GET /api/admin/users
// ══════════════════════════════════════════════
exports.getAllUsers = async (req, res) => {
  try {
    const { role, isActive, search, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === "true";
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      users,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ══════════════════════════════════════════════
//  GET SINGLE USER  →  GET /api/admin/users/:id
// ══════════════════════════════════════════════
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ══════════════════════════════════════════════
//  CREATE USER  →  POST /api/admin/users
// ══════════════════════════════════════════════
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "Name, email and password are required" });

    if (password.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters" });

    const exists = await User.findOne({ email: email.toLowerCase().trim() });
    if (exists)
      return res.status(400).json({ message: "Email already registered" });

    // Only super_admin can create another admin/super_admin
    const requestingUser = await User.findById(req.user);
    const restrictedRoles = ["admin", "super_admin"];
    if (restrictedRoles.includes(role) && requestingUser.role !== "super_admin") {
      return res.status(403).json({ message: "Only super_admin can create admin accounts" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: role || "agent",
      phone: phone || "",
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    if (err.code === 11000)
      return res.status(400).json({ message: "Email already registered" });
    res.status(500).json({ message: "Server error" });
  }
};

// ══════════════════════════════════════════════
//  UPDATE USER  →  PUT /api/admin/users/:id
// ══════════════════════════════════════════════
exports.updateUser = async (req, res) => {
  try {
    const { name, email, role, phone, isActive } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Only super_admin can change role to admin/super_admin
    const requestingUser = await User.findById(req.user);
    const restrictedRoles = ["admin", "super_admin"];
    if (role && restrictedRoles.includes(role) && requestingUser.role !== "super_admin") {
      return res.status(403).json({ message: "Only super_admin can assign admin roles" });
    }

    // Prevent admin from editing another admin/super_admin (unless self)
    if (
      restrictedRoles.includes(user.role) &&
      requestingUser.role !== "super_admin" &&
      user._id.toString() !== req.user
    ) {
      return res.status(403).json({ message: "Cannot edit admin accounts" });
    }

    if (name) user.name = name.trim();
    if (email) user.email = email.toLowerCase().trim();
    if (role) user.role = role;
    if (phone !== undefined) user.phone = phone;
    if (isActive !== undefined) user.isActive = isActive;

    await user.save();

    res.json({
      message: "User updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        isActive: user.isActive,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ══════════════════════════════════════════════
//  TOGGLE USER STATUS  →  PATCH /api/admin/users/:id/toggle-status
// ══════════════════════════════════════════════
exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Cannot deactivate yourself
    if (user._id.toString() === req.user)
      return res.status(400).json({ message: "Cannot deactivate your own account" });

    // Only super_admin can deactivate admins
    const requestingUser = await User.findById(req.user);
    if (
      ["admin", "super_admin"].includes(user.role) &&
      requestingUser.role !== "super_admin"
    ) {
      return res.status(403).json({ message: "Cannot deactivate admin accounts" });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      message: `User ${user.isActive ? "activated" : "deactivated"} successfully`,
      isActive: user.isActive,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ══════════════════════════════════════════════
//  RESET USER PASSWORD  →  PATCH /api/admin/users/:id/reset-password
// ══════════════════════════════════════════════
exports.resetUserPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters" });

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ══════════════════════════════════════════════
//  DELETE USER  →  DELETE /api/admin/users/:id
// ══════════════════════════════════════════════
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user._id.toString() === req.user)
      return res.status(400).json({ message: "Cannot delete your own account" });

    const requestingUser = await User.findById(req.user);
    if (
      ["admin", "super_admin"].includes(user.role) &&
      requestingUser.role !== "super_admin"
    ) {
      return res.status(403).json({ message: "Cannot delete admin accounts" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ══════════════════════════════════════════════
//  DASHBOARD STATS  →  GET /api/admin/stats
// ══════════════════════════════════════════════
exports.getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const inactiveUsers = await User.countDocuments({ isActive: false });

    // Count by role
    const roles = ["agent", "team_leader", "manager", "admin", "super_admin", "hr", "finance"];
    const roleCounts = {};
    for (const role of roles) {
      roleCounts[role] = await User.countDocuments({ role });
    }

    // Recently joined (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const newUsersThisWeek = await User.countDocuments({ createdAt: { $gte: sevenDaysAgo } });

    // Recently logged in (last 24 hrs)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentlyActive = await User.countDocuments({ lastLogin: { $gte: oneDayAgo } });

    res.json({
      totalUsers,
      activeUsers,
      inactiveUsers,
      newUsersThisWeek,
      recentlyActive,
      roleCounts,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ══════════════════════════════════════════════
//  RECENT USERS  →  GET /api/admin/recent-users
// ══════════════════════════════════════════════
exports.getRecentUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(5);
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
