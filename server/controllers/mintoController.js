import fs from "fs";
import imagekit from "../configs/imageKit.js";
import Post from "../models/Post.js";

// =========================
// 📌 1. Add Reel
// =========================
export const addReel = async (req, res) => {
  try {
    console.log("📂 Files received:", req.files);
    console.log("📝 Body received:", req.body);

    const { userId } = req.auth();
    const { content } = req.body; // optional caption
    const videos = req.files || [];

    if (!videos.length) {
      return res.status(400).json({ success: false, message: "❌ No video provided" });
    }

    const video = videos[0];
    const fileBuffer = fs.readFileSync(video.path);

    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: video.originalname || `video_${Date.now()}.mp4`,
      folder: "Reels",
    });

    fs.unlinkSync(video.path);

    const reel = await Post.create({
      user: userId,
      content,
      video_url: response.url,
      post_types: "reel",
      likes_count: [],
      comments: [],
      shares: 0,
    });

    res.json({ success: true, message: "✅ Reel Uploaded Successfully", reel });
  } catch (error) {
    console.error("❌ addReel error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================
// 📌 2. Get Reels
// =========================
export const getReels = async (req, res) => {
  try {
    const reels = await Post.find({ post_types: "reel" })
      .populate("user")
      .sort({ createdAt: -1 });

    res.json({ success: true, reels });
  } catch (error) {
    console.error("❌ getReels error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================
// 📌 3. Like / Unlike Reel
// =========================
export const likeReel = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { reelId } = req.body;

    const reel = await Post.findById(reelId);
    if (!reel || reel.post_types !== "reel") {
      return res.status(404).json({ success: false, message: "Reel not found" });
    }

    if (reel.likes_count.includes(userId)) {
      reel.likes_count = reel.likes_count.filter(u => u !== userId);
      await reel.save();
      return res.json({ success: true, message: "❌ Reel Unliked" });
    }

    reel.likes_count.push(userId);
    await reel.save();
    res.json({ success: true, message: "✅ Reel Liked" });
  } catch (error) {
    console.error("❌ likeReel error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================
// 📌 4. Comment on Reel
// =========================
export const commentReel = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { reelId, comment } = req.body;

    const reel = await Post.findById(reelId);
    if (!reel || reel.post_types !== "reel") {
      return res.status(404).json({ success: false, message: "Reel not found" });
    }

    const newComment = { user: userId, text: comment, created_at: new Date() };
    reel.comments.push(newComment);
    await reel.save();

    res.json({ success: true, message: "✅ Comment Added", comment: newComment });
  } catch (error) {
    console.error("❌ commentReel error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================
// 📌 5. Share Reel
// =========================
export const shareReel = async (req, res) => {
  try {
    const { reelId } = req.body;

    const reel = await Post.findById(reelId);
    if (!reel || reel.post_types !== "reel") {
      return res.status(404).json({ success: false, message: "Reel not found" });
    }

    reel.shares += 1;
    await reel.save();

    res.json({ success: true, message: "✅ Reel Shared", totalShares: reel.shares });
  } catch (error) {
    console.error("❌ shareReel error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
