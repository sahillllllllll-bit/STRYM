import fs from "fs";
import imagekit from "../configs/imageKit.js";
import Message from "../models/Message.js";
import mongoose from "mongoose";

// SSE connections
const connections = {};

// SSE setup
export const ssecontroller = (req, res) => {
  const { userId } = req.params;
  console.log("New Client Connected:", userId);

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");

  connections[userId] = res;
  res.write("event: connected\ndata: connected\n\n");

  req.on("close", () => {
    delete connections[userId];
    console.log("Client disconnected:", userId);
  });
};

export const sendMessage = async (req, res) => {
  try {
    const { userId } = req.auth; // Clerk middleware sets req.auth.userId
    const { to_user_id, text } = req.body;
    const image = req.file;

    // Validation: check to_user_id exists
    if (!to_user_id) {
      return res.status(400).json({ success: false, message: "to_user_id is required" });
    }

    let media_url = "";
    const message_type = image ? "image" : "text";

    // Handle image upload if it exists
    if (image) {
      const fileBuffer = await fs.promises.readFile(image.path); // async read
      const response = await imagekit.upload({
        file: fileBuffer,
        fileName: image.originalname,
      });

      media_url = imagekit.url({
        path: response.filePath,
        transformation: [
          { quality: "auto" },
          { format: "webp" },
          { width: "1280" },
        ],
      });
    }

    // Create the message
    const message = await Message.create({
      from_user_id: userId, // Clerk ID as string
      to_user_id,           // Clerk ID as string
      text: text || "",
      message_type,
      media_url,
    });

    res.json({ success: true, message });

    // Populate sender info and send via SSE
    const populated = await Message.findById(message._id).populate("from_user_id to_user_id");
    if (connections[to_user_id]) {
      connections[to_user_id].write(`data: ${JSON.stringify(populated)}\n\n`);
    }

  } catch (error) {
    console.error('sendMessage error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// Get chat messages
export const getChatMessage = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { to_user_id } = req.body;

    const messages = await Message.find({
      $or: [
        { from_user_id: userId, to_user_id },
        { from_user_id: to_user_id, to_user_id: userId },
      ],
    })
      .populate("from_user_id to_user_id")
      .sort({ created_at: -1 });

    await Message.updateMany({ from_user_id: to_user_id, to_user_id: userId }, { seen: true });

    res.json({ success: true, messages });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// Recent messages
export const getUserRecentMessages = async (req, res) => {
  try {
    const { userId } = req.auth();
    const messages = await Message.find({ to_user_id: userId })
      .populate("from_user_id to_user_id")
      .sort({ created_at: -1 });

    res.json({ success: true, messages });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
