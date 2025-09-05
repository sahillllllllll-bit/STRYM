import express from "express";
import multer from "multer";
import { genAI } from "../utils/geminiClient.js";

const router = express.Router();
const upload = multer(); // memory storage for uploaded files

router.post("/", upload.single("image"), async (req, res, next) => {
  try {
    const { message } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const parts = [];
    if (message) parts.push({ text: message });

    if (req.file) {
      parts.push({
        inlineData: {
          data: req.file.buffer.toString("base64"),
          mimeType: req.file.mimetype,
        },
      });
    }

    const result = await model.generateContent(parts);
    res.json({ reply: result.response.text() });
  } catch (err) {
    next(err); // Handled by inline error middleware in server.js
  }
});

export default router;
