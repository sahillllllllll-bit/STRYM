

import imagekit from "../configs/imageKit.js";
import Connection from "../models/Connection.js";
import Post from "../models/Post.js";
import User from "../models/User.js";
import fs from "fs";


// get user data
export const getUserData = async (req, res) => {
  try {
    const { userId } = req.auth();
    const user = await User.findById(userId)

    if (!user) {
      return res.json({ success: false, message: "User Not Found" })
    }
    res.json({ success: true, user })
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message })
  }
}

// update user data 

export const updateUserData = async (req, res) => {
  try {
    const { userId } = req.auth();
    let { username, bio, location, full_name } = req.body;

    const tempUser = await User.findById(userId);
    !username && (username = tempUser.username);

    if (tempUser.username !== username) {
      const user = await User.findOne({ username })
      if (user) {
        username = tempUser;  // not change the username 
      }
    }

    const updatedData = {
      username,
      bio,
      location,
      full_name,
    }

    const profile = req.files.profile && req.files.profile[0];
    const cover = req.files.cover && req.files.cover[0];

    if (profile) {
      const buffer = fs.readFileSync(profile.path)
      const response = await imagekit.upload({
        file: buffer,
        filename: profile.originalname,
      })

      const url = imagekit.url({
        path: response.filePath,
        transformation: [
          { quality: 'auto' },
          { format: 'webp' },
          { width: '512' }
        ]
      })

      updatedData.profile_picture = url;
    }

    if (cover) {
      const buffer = fs.readFileSync(cover.path)
      const response = await imagekit.upload({
        file: buffer,
        filename: profile.originalname,
      })

      const url = imagekit.url({
        path: response.filePath,
        transformation: [
          { quality: 'auto' },
          { format: 'webp' },
          { width: '1280' }
        ]
      })

      updatedData.cover_photo = url;
    }


    const user = await User.findByIdAndUpdate(userId, updatedData, { new: true })
    res.json({ success: true, message: "Profile Updated successfully" })

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message })
  }
}


//  ddiscover user data using email , id, location , bio

export const discoverUser = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { input } = req.body;

    const allUsers = await User.find({
      $or: [
        { username: new RegExp(input, 'i') },
        { email: new RegExp(input, 'i') },
        { full_name: new RegExp(input, 'i') },
        { location: new RegExp(input, 'i') }
      ]
    })
    const filteredUser = allUsers.filter(user => user._id !== userId);
    res.json({ success: true, users: filteredUser })


  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message })
  }
}

// to follow the user 


export const followUser = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.body;

    const user = await User.findById(userId);
    if (user.following.includes(id)) {
      return res.json({ success: false, message: 'You Are Already following this user' });
    }
    user.following.push(id);
    await user.save();

    // also increase the foolower of another user
    const touser = await User.findById(id);
    touser.followers.push(userId);
    await touser.save();

    res.json({ success: true, message: 'Now You Are Following This User' })

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message })
  }
}

// to unfollow the user

export const unfollowUser = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.body;

    const user = await User.findById(userId);
    user.following = user.following.filter(user => user !== id)
    await user.save();

    // also increase the foolower of another user
    const touser = await User.findById(id);
    touser.followers = touser.followers.filter(user => user !== userId)
    await touser.save();

    res.json({ success: true, message: ' You Are No Longer Following This User' })

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message })
  }
}


// send connection request 

export const sendconnectionrequest = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.body;

    // check if user sent more than 20 requests- so, he cannot send more requests..

    const last24hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const connectionrequest = await Connection.find({ from_user_id: userId, created_at: { $gt: last24hours } })
    if (connectionrequest.length > 20) {
      return res.json({ success: false, message: 'you have sent more than 20 connection requests in the last 24 hours' })
    }

    // check if the users are already connected
    const connection = await connection.findOne({
      $or: [
        { from_user_id: userId, to_user_id: id },
        { from_user_id: id, to_user_id: userId }
      ]
    })
    if (!connection) {
       const newconnection=  await connection.create({
        from_user_id: userId,
        to_user_id: id,
      })

      await inngest.send({
        name:'app/connection-request',
        data:{connectionId :newconnection._id}
      })


      return res.json({ success: true, message: 'Connection Request Send Successfully' })
    }
    else if (connection && connection.status === 'accepted') {
      return res.json({ success: false, message: 'You Are Already Connected With This User' })
    }
    return res.json({ success: false, message: 'Connection Request Pending' })
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message })
  }
}



// get user data
 export const getuserconnections =async (req,res) => {
  try {
    const {userId} = reqauth();
    const user = await User.findById(userId).populate('connections followers following')
    const connections= user.connections
    const followers= user.followers
    const following =user.following

    const pendingconnections =(await Connection.find({to_user_id:userId,status:'pending'}).populate('from_user_id')).map(connection=>connection.from_user_id)

  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }
 }

 // send connection request
 export const acceptconnectionrequest =async (req,res) => {
  try {
    const {userId} = reqauth();
   const {id}= req.body;

   const connection = await Connection.findOne({from_user_id:id,to_user_id:userId})
  if(!connection){
  return res.json({success:false,message:'Connection Not Found'})
  }

  const user = await User.findById(userId)
  user.connections.push(id);
   await user.save();

     const touser = await User.findById(id)
  touser.connections.push(userId);
   await touser.save();

   connection.status ='accepted';
   await connection.save();

   res.json({success:true,message:'Connection Accepted Successfully'})

  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }
 }

 //get user profiles

 export const getUserProfiles =async (req,res) => {
  try {
     const {profileId} = req.body;
     const profile = await User.findById(profileId)
     if(!profile){
       return res.json({success:false,message:"Profile Not Found"})
     }
const posts = await Post.find({user:profileId}).populate('user')
  res.json({success:true,profile, posts})

  } catch (error) {
     console.log(error)
    res.json({success:false,message:error.message})
  }
 }