const CallLog = require("../models/CallLog");
const User = require("../models/User");

// ──────────────────────────────────────────────────────────────
// GET /api/dashboard/stats
// Get all dashboard data for logged-in user (agent/employee)
// ──────────────────────────────────────────────────────────────
exports.getDashboardStats = async (req, res) => {
    try {
        const userId = req.user._id;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // ── Summary Stats ─────────────────────────────────────
        const totalCalls = await CallLog.countDocuments({ agent: userId });
        const todayCalls = await CallLog.countDocuments({ 
            agent: userId, 
            calledAt: { $gte: today } 
        });
        
        const incomingCalls = await CallLog.countDocuments({ 
            agent: userId, 
            callType: "Incoming" 
        });
        
        const outgoingCalls = await CallLog.countDocuments({ 
            agent: userId, 
            callType: "Outgoing" 
        });
        
        const missedCalls = await CallLog.countDocuments({ 
            agent: userId, 
            callStatus: "Missed" 
        });
        
        const connectedCalls = await CallLog.countDocuments({ 
            agent: userId, 
            callStatus: "Connected" 
        });
        
        // Average duration
        const avgDurationAgg = await CallLog.aggregate([
            { $match: { agent: userId, durationSeconds: { $gt: 0 } } },
            { $group: { _id: null, avgDuration: { $avg: "$durationSeconds" } } }
        ]);
        const avgDurationSeconds = avgDurationAgg[0]?.avgDuration || 0;
        const avgDurationFormatted = formatDuration(avgDurationSeconds);
        
        // Connect rate
        const connectRate = totalCalls > 0 
            ? Math.round((connectedCalls / totalCalls) * 100) 
            : 0;

        // ── Weekly Trend (last 7 days) ────────────────────────
        const weeklyTrend = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);
            
            const nextDate = new Date(date);
            nextDate.setDate(nextDate.getDate() + 1);
            
            const dayCalls = await CallLog.countDocuments({
                agent: userId,
                calledAt: { $gte: date, $lt: nextDate }
            });
            
            const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            weeklyTrend.push({
                day: dayNames[date.getDay()],
                total: dayCalls,
                incoming: await CallLog.countDocuments({
                    agent: userId,
                    callType: "Incoming",
                    calledAt: { $gte: date, $lt: nextDate }
                }),
                outgoing: await CallLog.countDocuments({
                    agent: userId,
                    callType: "Outgoing",
                    calledAt: { $gte: date, $lt: nextDate }
                }),
                missed: await CallLog.countDocuments({
                    agent: userId,
                    callStatus: "Missed",
                    calledAt: { $gte: date, $lt: nextDate }
                })
            });
        }

        // ── Recent Calls (last 10) ───────────────────────────
        const recentCalls = await CallLog.find({ agent: userId })
            .sort({ calledAt: -1 })
            .limit(10)
            .populate("agent", "name email")
            .lean();

        const formattedRecentCalls = recentCalls.map(call => ({
            _id: call._id,
            name: call.customerName || "Unknown",
            number: call.customerNumber,
            type: call.callType,
            duration: formatDuration(call.durationSeconds),
            status: call.callStatus,
            time: formatTime(call.calledAt),
            avatar: getInitials(call.customerName || "U")
        }));

        // ── Top Agents (if admin/manager) ─────────────────────
        let topAgents = [];
        const userRole = req.user.role;
        
        if (["admin", "super_admin", "manager"].includes(userRole)) {
            // Get agents with most connected calls
            const agentStats = await CallLog.aggregate([
                { $match: { callStatus: "Connected" } },
                { $group: {
                    _id: "$agent",
                    connectedCalls: { $sum: 1 }
                }},
                { $sort: { connectedCalls: -1 } },
                { $limit: 5 }
            ]);
            
            const agentIds = agentStats.map(s => s._id);
            const agents = await User.find({ _id: { $in: agentIds } })
                .select("name email role");
            
            topAgents = agents.map(agent => {
                const stats = agentStats.find(s => s._id.toString() === agent._id.toString());
                return {
                    name: agent.name,
                    calls: stats?.connectedCalls || 0,
                    connected: stats?.connectedCalls || 0,
                    avatar: getInitials(agent.name),
                    color: getAvatarColor(agent._id)
                };
            });
        }

        // ── Response ─────────────────────────────────────────
        res.json({
            success: true,
            summary: {
                totalCalls,
                todayCalls,
                incomingCalls,
                outgoingCalls,
                missedCalls,
                connectedCalls,
                avgDuration: avgDurationFormatted,
                avgDurationSeconds,
                connectRate
            },
            weeklyTrend,
            recentCalls: formattedRecentCalls,
            topAgents,
            user: {
                name: req.user.name,
                role: req.user.role
            }
        });
        
    } catch (err) {
        console.error("getDashboardStats error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// ──────────────────────────────────────────────────────────────
// Helper Functions
// ──────────────────────────────────────────────────────────────
function formatDuration(seconds) {
    if (!seconds || seconds === 0) return "0s";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    return secs === 0 ? `${mins}m` : `${mins}m ${secs}s`;
}

function formatTime(date) {
    if (!date) return "";
    return new Date(date).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    });
}

function getInitials(name) {
    if (!name || name === "Unknown") return "U";
    return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
}

function getAvatarColor(id) {
    const colors = ["bg-blue-500", "bg-violet-500", "bg-emerald-500", "bg-rose-500", "bg-amber-500", "bg-cyan-500"];
    const hash = id.toString().split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
}