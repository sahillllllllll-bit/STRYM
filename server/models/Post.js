import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  user: { type: String, ref: 'User', required: true },
  content: { type: String },
  image_urls: [{ type: String }],
  video_url: { type: String },
  post_types: { 
    type: String, 
    enum: ['text', 'image', 'text_with_images', 'video', 'reel'], // 'reel' added
    required: true 
  },
  likes_count: [{ type: String, ref: 'User' }],
  comments: [
    {
      user: { type: String, ref: 'User' },
      text: String,
      created_at: { type: Date, default: Date.now }
    }
  ],
  shares: { type: Number, default: 0 }
}, { timestamps: true, minimize: false });

const Post = mongoose.model('post', postSchema);
export default Post;
