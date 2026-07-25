import express from "express";
import { generateTest } from "../controllers/testController.js";
import { chat, getChatHistory, recommendations } from "../controllers/aiController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();
router.post("/generate-test", protect, generateTest);
router.post("/chat", protect, chat);
router.get("/chat", protect, getChatHistory);
router.get("/recommendations", protect, recommendations);

export default router;
