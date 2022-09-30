import express from "express";
import { createRoom, getRoom, assignLog, getLog } from "../controllers/room.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Create room
router.post("/", verifyToken, createRoom);

// Get room
router.get("/:roomId", getRoom);

// Get logs
router.get("/getLogs/:roomId", getLog);

// Assign log
router.post("/assignLog", assignLog);

export default router;
