import React, { useState } from "react";
import { dummyUserData } from "../assets/assets";
import { X, Video, CirclePlus } from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const Createpost = () => {
  const [content, setContent] = useState("");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  const user = dummyUserData;

  const handleSubmit = async () => {
    try {
      setLoading(true);
      // 🔹 Here you’d normally upload video + content to backend
      await new Promise((res) => setTimeout(res, 2000)); // mock API delay
      setContent("");
      setVideos([]);
      return true; // success
    } catch (err) {
      throw new Error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto p-6">
        {/* title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Upload Short Video
          </h1>
          <p className="text-slate-600">Share your short video with the world</p>
        </div>

        {/* form */}
        <div className="max-w-xl bg-white p-4 sm:p-8 sm:pb-3 rounded-xl shadow-md space-y-4">
          <div className="flex items-center gap-3">
            <img
              src={user.profile_picture}
              alt=""
              className="w-12 h-12 rounded-full shadow"
            />
            <div>
              <h2 className="font-semibold">{user.full_name}</h2>
              <p className="text-sm text-gray-500">@{user.username}</p>
            </div>
          </div>

          {/* textarea */}
          <textarea
            className="w-full resize-none max-h-20 mt-4 text-sm outline-none placeholder-gray-400"
            placeholder="Write a caption for your video..."
            onChange={(e) => setContent(e.target.value)}
            value={content}
          />

          {/* video preview */}
          {videos.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {videos.map((video, i) => (
                <div key={i} className="relative group">
                  <video
                    src={URL.createObjectURL(video)}
                    className="h-40 rounded-md"
                    controls
                  />
                  <div
                    onClick={() =>
                      setVideos(videos.filter((_, index) => index !== i))
                    }
                    className="absolute hidden group-hover:flex justify-center items-center top-0 right-0 bottom-0 left-0 bg-black/40 rounded-md cursor-pointer"
                  >
                    <X className="w-6 h-6 text-white" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* bottom */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-300">
            <label
              htmlFor="video"
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition cursor-pointer"
            >
              <Video className="size-6" />
              <span>Select Video</span>
            </label>

            {/* input for only videos */}
            <input
              type="file"
              id="video"
              accept="video/*"
              hidden
              multiple
              onChange={(e) => setVideos([...videos, ...e.target.files])}
            />

            <button
              disabled={loading}
              onClick={() =>
                toast.promise(handleSubmit(), {
                  loading: "Uploading...",
                  success: <p>Video Uploaded 🎉</p>,
                  error: <p>Upload Failed ❌</p>,
                })
              }
              className="text-sm bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition text-white font-medium px-8 py-2 rounded-md cursor-pointer"
            >
              {loading ? "Uploading..." : "Publish Video"}
            </button>
          </div>
        </div>
      </div>
       <Link to='/create-post' className='flex items-center justify-center gap-2 py-2.5 mt-6 mx-6 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600  hover:to-purple-800 active:scale-95  transition text-white cursor-pointer'>
  <CirclePlus className='h-5 w-5'/>
  Create Post 
 </Link>
    </div>
  );
};

export default Createpost;
