import express from "express"
import { protect } from "../middlewares/auth.js"
import { addPost, getfeedPosts, likePost } from "../controllers/postController.js"
import { upload } from "../configs/multer.js"
const postRouter =express.Router()

postRouter.post('/add', upload.array('images',4),protect,addPost)
postRouter.get('/feed',protect,getfeedPosts)
postRouter.post('/like',protect,likePost)

export default postRouter
