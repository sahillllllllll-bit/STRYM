import express from "express";
import { protect } from "../middlewares/auth.js";
import { acceptconnectionrequest, discoverUser, followUser, getuserconnections, getUserData, sendconnectionrequest, unfollowUser, updateUserData } from "../controllers/userController.js";
import { upload } from "../configs/multer.js";

const userRouter =express.Router();

userRouter.get('/data', protect,getUserData);
userRouter.post('/update',upload.fields([{name:'profile',maxCount:1},{name:'cover',maxCount:1}]),protect,updateUserData)     
userRouter.post('/discover',protect,discoverUser);
userRouter.post('/follow',protect,followUser)
userRouter.post('/unfollow',protect,unfollowUser)
userRouter.post('/connect',protect,sendconnectionrequest)
userRouter.post('/accept',protect,acceptconnectionrequest)
userRouter.get('/connections',protect,getuserconnections)


export default userRouter;