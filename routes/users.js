import express from "express";
import {
  deleteUser,
  getUser,
  updateUser,
} from "../controllers/user.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Update user
router.put("/:id", verifyToken, updateUser);

// Delete user
router.delete("/:id", verifyToken, deleteUser);

// Get a user
router.get("/:id", getUser);

export default router;
