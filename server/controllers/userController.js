
import imagekit from "../configs/imageKit.js";
import User from "../models/User.js";
import fs from "fs";


// get user data
export const getUserData = async (req,res) => {
    try {
        const {userId}= req.auth();
       const user =await User.findById(userId)

       if(!user){
         return res.json({success:false,message:"User Not Found"})
       }
       res.json({success:true,user})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

// update user data 

export const updateUserData = async (req,res) => {
    try {
        const {userId}= req.auth();
       const {username,bio,location,full_name}=req.body;

       const tempUser=await User.findById(userId);
  !username&&(username= tempUser.username);

  if(tempUser.username!== username){
    const user= User.findOne({username})
    if(user){
        username=tempUser;  // not change the username 
    }
  }

  const updatedData={
    username,
    bio,
    location,
    full_name,
  }

  const profile =req.files.profile && req.files.profile[0];
    const cover =req.files.cover && req.files.cover[0];

    if(profile){
        const buffer =fs.readFileSync(profile.path)
        const response = await imagekit.upload({
            file:buffer,
            filename:profile.originalname,
        })

         const url =imagekit.url({
            path:response.filePath,
            transformation:[
                {quality:'auto'},
                {format :'webp'},
                {width:'512'}
            ]
         })

       updatedData.profile_picture =url;
    }

        if(cover){
        const buffer =fs.readFileSync(cover.path)
        const response = await imagekit.upload({
            file:buffer,
            filename:profile.originalname,
        })

         const url =imagekit.url({
            path:response.filePath,
            transformation:[
                {quality:'auto'},
                {format :'webp'},
                {width:'1280'}
            ]
         })

       updatedData.cover_photo =url;
    }


  const user =await User.findByIdAndUpdate(userId,updatedData,{new : true})
  res.json({success:true,message:"Profile Updated successfully"})
      
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}


//  ddiscover user data using email , id, location , bio

export const discoverUser = async (req,res) => {
    try {
        const {userId}= req.auth();
        const {input}= req.body;

        const allUsers = await User.find({
          $or:[
          {username:new RegExp(input,'i')},
            {email:new RegExp(input,'i')},
            {full_name:new RegExp(input,'i')},
            {location:new RegExp(input,'i')}
          ]
        })
        const filteredUser=allUsers.filter(user=>user._id!==userId);
        res.json({success:true,users:filteredUser})

    
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

// to follow the user 


export const followUser = async (req,res) => {
    try {
        const {userId}= req.auth();
        const {id}= req.body;

      const user =await User.findById(userId);
      if(user.following.includes(id)){
        return res.json({success:false,message:'You Are Already following this user'});
      }
      user.following.push(id);
      await user.save();

// also increase the foolower of another user
      const touser = await User.findById(id);
      touser.followers.push(userId); 
      await touser.save();

      res.json({success:true,message:'Now You Are Following This User'})
    
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

// to unfollow the user

export const unfollowUser = async (req,res) => {
    try {
        const {userId}= req.auth();
        const {id}= req.body;

      const user =await User.findById(userId);
      user.following = user.following.filter(user=>user!==id) 
      await user.save();

// also increase the foolower of another user
      const touser = await User.findById(id);
       touser.followers = touser.followers.filter(user=>user!==userId) 
      await touser.save();

      res.json({success:true,message:' You Are No Longer Following This User'})
    
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

