import express from "express";
import { submitResult, getResults, getResultById } from "../controllers/resultController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();
router.post("/", protect, submitResult);
router.get("/", protect, getResults);
router.get("/:id", protect, getResultById);

export default router;
