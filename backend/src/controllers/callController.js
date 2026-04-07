const CallLog = require("../models/CallLog");

// ── Helper: convert duration seconds to "Xm Ys" format ──
const formatDuration = (seconds) => {
    if (!seconds || seconds === 0) return "0s";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    if (m === 0) return `${s}s`;
    return s === 0 ? `${m}m` : `${m}m ${s}s`;
};

// ─────────────────────────────────────────────────────────
// GET /api/calls
// ─────────────────────────────────────────────────────────
exports.getCallLogs = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            search = "",
            callType,
            callStatus,
            dateFrom,
            dateTo,
            sortField = "calledAt",
            sortDir = "desc",
        } = req.query;

        const query = { agent: req.user._id };

        if (search.trim()) {
            query.$or = [
                { customerName: { $regex: search.trim(), $options: "i" } },
                { customerNumber: { $regex: search.trim(), $options: "i" } },
            ];
        }

        if (callType && callType !== "All") query.callType = callType;
        if (callStatus && callStatus !== "All") query.callStatus = callStatus;

        if (dateFrom || dateTo) {
            query.calledAt = {};
            if (dateFrom) query.calledAt.$gte = new Date(dateFrom);
            if (dateTo) {
                const end = new Date(dateTo);
                end.setHours(23, 59, 59, 999);
                query.calledAt.$lte = end;
            }
        }

        const sortOrder = sortDir === "asc" ? 1 : -1;
        const sortObj = { [sortField]: sortOrder };

        const total = await CallLog.countDocuments(query);
        const calls = await CallLog.find(query)
            .sort(sortObj)
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .populate("agent", "name email role")
            .lean();

        const logs = calls.map((c) => ({
            _id: c._id,
            customerName: c.customerName || "Unknown",
            customerNumber: c.customerNumber,
            callType: c.callType,
            callStatus: c.callStatus,
            durationSeconds: c.durationSeconds,
            calledAt: c.calledAt,
            notes: c.notes,
            agent: c.agent,
        }));

        res.json({
            logs,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / limit),
            },
        });
    } catch (err) {
        console.error("getCallLogs error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// ─────────────────────────────────────────────────────────
// POST /api/calls
// ─────────────────────────────────────────────────────────
exports.createCallLog = async (req, res) => {
    try {
        const {
            customerName,
            customerNumber,
            callType,
            callStatus,
            durationSeconds,
            notes,
            calledAt,
        } = req.body;

        console.log("Creating call log for user:", req.user._id, req.user.name);

        if (!customerNumber) {
            return res.status(400).json({ message: "Phone number is required" });
        }
        if (!callType || !["Incoming", "Outgoing"].includes(callType)) {
            return res.status(400).json({ message: "Valid call type required: Incoming or Outgoing" });
        }

        const callLog = await CallLog.create({
            agent: req.user._id,
            customerName: customerName || "",
            customerNumber,
            callType,
            callStatus: callStatus || "Connected",
            durationSeconds: Number(durationSeconds) || 0,
            notes: notes || "",
            calledAt: calledAt ? new Date(calledAt) : new Date(),
        });

        res.status(201).json({
            message: "Call log saved successfully ✅",
            call: {
                _id: callLog._id,
                customerName: callLog.customerName || "Unknown",
                customerNumber: callLog.customerNumber,
                callType: callLog.callType,
                callStatus: callLog.callStatus,
                durationSeconds: callLog.durationSeconds,
                calledAt: callLog.calledAt,
                notes: callLog.notes,
            },
        });
    } catch (err) {
        console.error("createCallLog error:", err);
        if (err.name === "ValidationError") {
            return res.status(400).json({
                message: "Validation failed",
                errors: Object.values(err.errors).map(e => e.message)
            });
        }
        res.status(500).json({ message: "Failed to save call log" });
    }
};

// ─────────────────────────────────────────────────────────
// PUT /api/calls/:id
// ─────────────────────────────────────────────────────────
exports.updateCallLog = async (req, res) => {
    try {
        const call = await CallLog.findOne({
            _id: req.params.id,
            agent: req.user._id,
        });

        if (!call) return res.status(404).json({ message: "Call log not found" });

        const allowed = ["notes", "customerName", "callType", "callStatus", "durationSeconds", "calledAt"];
        allowed.forEach((field) => {
            if (req.body[field] !== undefined) call[field] = req.body[field];
        });

        await call.save();
        res.json({ message: "Call log updated successfully ✅" });
    } catch (err) {
        console.error("updateCallLog error:", err);
        res.status(500).json({ message: "Failed to update call log" });
    }
};

// ─────────────────────────────────────────────────────────
// DELETE /api/calls/:id
// ─────────────────────────────────────────────────────────
exports.deleteCallLog = async (req, res) => {
    try {
        const call = await CallLog.findOneAndDelete({
            _id: req.params.id,
            agent: req.user._id,
        });
        if (!call) return res.status(404).json({ message: "Call log not found" });
        res.json({ message: "Call log deleted successfully" });
    } catch (err) {
        console.error("deleteCallLog error:", err);
        res.status(500).json({ message: "Failed to delete call log" });
    }
};

// ─────────────────────────────────────────────────────────
// GET /api/calls/stats
// ─────────────────────────────────────────────────────────
exports.getCallStats = async (req, res) => {
    try {
        const agentId = req.user._id;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [total, todayCalls, connected, missed, incoming, outgoing] =
            await Promise.all([
                CallLog.countDocuments({ agent: agentId }),
                CallLog.countDocuments({ agent: agentId, calledAt: { $gte: today } }),
                CallLog.countDocuments({ agent: agentId, callStatus: "Connected" }),
                CallLog.countDocuments({ agent: agentId, callStatus: "Missed" }),
                CallLog.countDocuments({ agent: agentId, callType: "Incoming" }),
                CallLog.countDocuments({ agent: agentId, callType: "Outgoing" }),
            ]);

        const connectRate = total > 0 ? Math.round((connected / total) * 100) : 0;

        res.json({
            total,
            todayCalls,
            connected,
            missed,
            incoming,
            outgoing,
            connectRate,
        });
    } catch (err) {
        console.error("getCallStats error:", err);
        res.status(500).json({ message: "Failed to load stats" });
    }
};
