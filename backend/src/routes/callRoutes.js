const express = require("express");
const {
    getCallLogs,
    createCallLog,
    updateCallLog,
    deleteCallLog,
    getCallStats,
} = require("../controllers/callController");


const protect = require("../middlewares/authMiddleware");

const router = express.Router();

// All routes require authentication
router.use(protect);

// Stats
router.get("/stats", getCallStats);

// CRUD
router.get("/", getCallLogs);
router.post("/", createCallLog);
router.put("/:id", updateCallLog);
router.delete("/:id", deleteCallLog);

module.exports = router;