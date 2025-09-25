import React, { useEffect, useRef, useState } from "react";
import { Heart, MessageCircle, Share2, MoreVertical, Play, Pause, Volume2, VolumeX, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

export default function Minto({ onClose }) {
  const containerRef = useRef(null);
  const videoRefs = useRef([]);
  const [current, setCurrent] = useState(0);
  const [likes, setLikes] = useState({});
  const [following, setFollowing] = useState({});
  const [muted, setMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [reelsData, setReelsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const isTransitioningRef = useRef(false);
  const touchStartYRef = useRef(0);

  const navigate = useNavigate();
  const { getToken } = useAuth();

  // Lock scroll
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = prevOverflow);
  }, []);

  // Fetch reels
  const fetchReels = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/api/minto/feed", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) setReelsData(data.reels);
      else toast.error(data.message);

      console.log("Fetched reels:", data.reels); // 🔽 Added: Debug log
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReels();
  }, []);

  // Play only current reel
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      v.muted = muted;
      if (i === current) {
        if (isPlaying) v.play().catch(() => {});
      } else {
        v.pause();
        v.currentTime = 0;
      }
    });
  }, [current, muted, isPlaying]);

  // Navigation functions
  const goTo = (nextIndex) => {
    if (nextIndex < 0 || nextIndex >= reelsData.length) return;
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    setCurrent(nextIndex);
    setTimeout(() => (isTransitioningRef.current = false), 450);
  };
  const next = () => goTo(current + 1);
  const prev = () => goTo(current - 1);

  // Mouse wheel navigation
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e) => {
      e.preventDefault();
      if (e.deltaY > 30) next();
      else if (e.deltaY < -30) prev();
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [current, reelsData]);

  // Touch navigation
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onTouchStart = (e) => (touchStartYRef.current = e.touches[0].clientY);
    const onTouchEnd = (e) => {
      const delta = touchStartYRef.current - e.changedTouches[0].clientY;
      if (delta > 50) next();
      else if (delta < -50) prev();
    };
    el.addEventListener("touchstart", onTouchStart, { passive: false });
    el.addEventListener("touchend", onTouchEnd, { passive: false });
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [current, reelsData]);

  // Keyboard controls
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowUp") prev();
      if (e.key === "ArrowDown") next();
      if (e.key === " ") {
        e.preventDefault();
        togglePlay();
      }
      if (e.key.toLowerCase() === "m") toggleMute();
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, isPlaying, muted, reelsData]);

  const togglePlay = () => {
    const v = videoRefs.current[current];
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
      setIsPlaying(true);
    } else {
      v.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const v = videoRefs.current[current];
    if (!v) return;
    v.muted = !muted;
    setMuted(v.muted);
  };

  const handleClose = () => {
    if (onClose) onClose();
    else navigate("/");
  };

  const toggleLike = (id) => setLikes((p) => ({ ...p, [id]: !p[id] }));
  const toggleFollow = (username) =>
    setFollowing((p) => ({ ...p, [username]: !p[username] }));

  if (loading) return <div className="text-white">Loading reels...</div>;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[1000] bg-black flex items-center justify-center overflow-hidden select-none"
    >
      <button
        onClick={handleClose}
        className="absolute top-5 left-5 z-[1100] p-2 bg-black/50 rounded-full text-white"
      >
        <X size={24} />
      </button>
      <div className="relative w-[100vw] h-[100vh] md:max-w-[420px] md:max-h-[740px]">
        {reelsData.map((reel, i) => (
          <div
            key={reel._id}
            className={`absolute inset-0 transition-transform duration-500 ease-out ${
              i === current
                ? "translate-y-0"
                : i < current
                ? "-translate-y-full"
                : "translate-y-full"
            }`}
          >
            <video
              ref={(el) => (videoRefs.current[i] = el)}
              src={reel.video_url}
              className="w-full h-full object-cover"
              loop
              playsInline
              muted={muted}
              onClick={togglePlay}
            />
            <div className="absolute bottom-20 left-4 right-24 text-white">
              <div className="flex items-center gap-3 mb-2">
                {/* 🔽 Changed: safe access + fallback */}
                <span className="font-semibold">
                  @{reel?.user?.username ?? "unknown"}
                </span>

                {/* 🔽 Changed: render follow button only if username exists */}
                {reel?.user?.username && (
                  <button
                    onClick={() => toggleFollow(reel.user.username)}
                    className="text-xs bg-white text-black px-3 py-1 rounded-full"
                  >
                    {following[reel.user.username]
                      ? "Following"
                      : "Follow"}
                  </button>
                )}
              </div>
              <p className="text-sm opacity-95 leading-snug">
                {reel.content}
              </p>
            </div>
            <div className="absolute bottom-24 right-3 flex flex-col gap-5 items-center text-white">
              <button onClick={() => toggleLike(reel._id)}>
                <Heart
                  size={28}
                  className={
                    likes[reel._id] ? "text-red-500 fill-red-500" : ""
                  }
                />
                <span className="text-[11px] mt-1">
                  {(
                    likes[reel._id]
                      ? reel.likes_count.length + 1
                      : reel.likes_count.length
                  ).toLocaleString()}
                </span>
              </button>
              <button>
                <MessageCircle size={28} />
              </button>
              <button>
                <Share2 size={28} />
              </button>
              <button>
                <MoreVertical size={28} />
              </button>
            </div>
            <div className="absolute bottom-6 left-4 flex gap-3">
              <button
                onClick={togglePlay}
                className="p-2 bg-black/50 rounded-full"
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              </button>
              <button
                onClick={toggleMute}
                className="p-2 bg-black/50 rounded-full"
              >
                {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
