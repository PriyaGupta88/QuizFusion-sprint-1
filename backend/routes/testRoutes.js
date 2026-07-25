import express from "express";
import { getTests, getTestById, deleteTest } from "../controllers/testController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();
router.get("/", protect, getTests);
router.get("/:id", protect, getTestById);
router.delete("/:id", protect, deleteTest);

export default router;
