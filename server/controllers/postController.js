import fs from "fs";
import imagekit from "../configs/imageKit.js";
import Post from "../models/Post.js";
import User from "../models/User.js";

//add post
export const addPost = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { content, post_types } = req.body;
    const images = req.files || [];

    console.log("📂 Files received:", images);
    console.log("📝 Body received:", req.body);

    let image_urls = [];

    if (images.length) {
      image_urls = await Promise.all(
        images.map(async (image, index) => {
          try {
            const fileBuffer = fs.readFileSync(image.path);

            const response = await imagekit.upload({
              file: fileBuffer,
              fileName: image.originalname || `upload_${Date.now()}_${index}.jpg`,
              folder: "Posts",
            });

            // cleanup temp file
            fs.unlinkSync(image.path);

            return response.url;
          } catch (err) {
            console.error("❌ Error uploading image:", err);
            throw err;
          }
        })
      );
    }

    await Post.create({
      user: userId,
      content,
      image_urls,
      post_types,
    });

    res.json({ success: true, message: "✅ Post Created Successfully" });
  } catch (error) {
    console.error("❌ addPost error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// get posts 
export const getfeedPosts = async (req, res) => {
  try {
    const { userId } = req.auth();
    const user = await User.findById(userId);

    const userIDs = [
      userId,
      ...(user.connections || []),
      ...(user.following || [])
    ];

    const posts = await Post.find({ user: { $in: userIDs } })
      .populate("user")
      .sort({ created_at: -1 });

    res.json({ success: true, posts });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};


// like posts 

export const likePost = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { postId } = req.body;

        const post = await Post.findById(postId);

        if (post.likes_count.includes(userId)) {
            post.likes_count = post.likes_count.filter(user => user !== userId)
            await post.save();
            res.json({ success: true, message: "Post Unliked" });
        } else {
            post.likes_count.push(userId);
            await post.save();
            res.json({ success: true, message: "Post liked" });
        }



    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}