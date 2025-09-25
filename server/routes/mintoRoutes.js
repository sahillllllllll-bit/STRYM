import express from "express";
import { protect } from "../middlewares/auth.js";
import { upload } from "../configs/multer.js";
import {
  addReel,
  getReels,
  likeReel,
  commentReel,
  shareReel
} from "../controllers/mintoController.js";

const reelRouter = express.Router();

// 🎥 Upload a reel (video only)
reelRouter.post("/add", protect, upload.array("videos", 1), addReel);

// 📂 Get all reels
reelRouter.get("/feed", protect, getReels);

// ❤️ Like/unlike reel
reelRouter.post("/like", protect, likeReel);

// 💬 Comment on reel
reelRouter.post("/comment", protect, commentReel);

// 🔄 Share reel
reelRouter.post("/share", protect, shareReel);

export default reelRouter;
