import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  full_name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    default: "Hey, there I am Using Strym."
  },
  profile_picture: {
    type: String,
    default: ""
  },
  cover_photo: {
    type: String,
    default: ""
  },
  location: {
    type: String,
    default: ""
  },
  followers: [
    {
      type: String,  // or mongoose.Schema.Types.ObjectId if you use ObjectIds
      ref: "User",
      default: []
    }
  ],
  following: [
    {
      type: String,
      ref: "User",
      default: []
    }
  ],
  connections: [
    {
      type: String,
      ref: "User",
      default: []
    }

  ]
}, { timestamps: true, minimize: false });

const User = mongoose.model("User", userSchema);

export default User;
