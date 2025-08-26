// Minto.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  MoreVertical,
  Play,
  Pause,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom"; // ✅ if using routing

const reelsData = [
  {
    id: 1,
    username: "traveler_01",
    caption: "Exploring the mountains 🌄",
    src: "https://www.w3schools.com/html/mov_bbb.mp4",
    likes: 1234567383,
  },
  {
    id: 2,
    username: "chef_life",
    caption: "Quick pasta recipe 🍝🔥",
    src: "https://www.w3schools.com/html/movie.mp4",
    likes: 987,
  },
  {
    id: 3,
    username: "tech_guru",
    caption: "5 coding tips to speed up ⌨️⚡",
    src: "https://www.w3schools.com/html/mov_bbb.mp4",
    likes: 432,
  },
   {
    id: 4,
    username: "tech_guru",
    caption: "5 coding tips to speed up ⌨️⚡",
    src: "https://www.w3schools.com/html/mov_bbb.mp4",
    likes: 432,
  },

   {
    id: 5,
    username: "tech_guru",
    caption: "5 coding tips to speed up ⌨️⚡",
    src: "https://www.w3schools.com/html/mov_bbb.mp4",
    likes: 432,
  },
   {
    id: 6,
    username: "tech_guru",
    caption: "5 coding tips to speed up ⌨️⚡",
    src: "https://www.w3schools.com/html/mov_bbb.mp4",
    likes: 432,
  },
   {
    id: 7,
    username: "tech_guru",
    caption: "5 coding tips to speed up ⌨️⚡",
    src: "https://www.w3schools.com/html/mov_bbb.mp4",
    likes: 432,
  },
   {
    id: 8,
    username: "tech_guru",
    caption: "5 coding tips to speed up ⌨️⚡",
    src: "https://www.w3schools.com/html/mov_bbb.mp4",
    likes: 432,
  },
];

export default function Minto({ onClose }) {
  const containerRef = useRef(null);
  const videoRefs = useRef([]);
  const [current, setCurrent] = useState(0);
  const [likes, setLikes] = useState({});
  const [following, setFollowing] = useState({});
  const [muted, setMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const isTransitioningRef = useRef(false);
  const touchStartYRef = useRef(0);

  const navigate = useNavigate(); // ✅ if using router

  // Lock page scroll
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
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

  const goTo = (nextIndex) => {
    if (nextIndex < 0 || nextIndex >= reelsData.length) return;
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    setCurrent(nextIndex);
    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 450);
  };

  const next = () => goTo(current + 1);
  const prev = () => goTo(current - 1);

  // Mouse wheel nav
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
  }, [current]);

  // Touch swipe nav
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onTouchStart = (e) => {
      touchStartYRef.current = e.touches[0].clientY;
    };
    const onTouchMove = (e) => e.preventDefault();
    const onTouchEnd = (e) => {
      const delta = touchStartYRef.current - e.changedTouches[0].clientY;
      if (delta > 50) next();
      else if (delta < -50) prev();
    };
    el.addEventListener("touchstart", onTouchStart, { passive: false });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd, { passive: false });
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [current]);

  // Keyboard
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
  }, [current, isPlaying, muted]);

  const toggleLike = (id) => setLikes((p) => ({ ...p, [id]: !p[id] }));
  const toggleFollow = (username) =>
    setFollowing((p) => ({ ...p, [username]: !p[username] }));
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
    if (onClose) onClose(); // close via parent state
    else navigate("/"); // or navigate back to feed route
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[1000] bg-black flex items-center justify-center overflow-hidden select-none"
    >
      {/* Close Button */}
      <button
        onClick={handleClose}
        className="absolute top-5 left-5 z-[1100] p-2 bg-black/50 rounded-full text-white"
        aria-label="Close"
      >
        <X size={24} />
      </button>

      <div className="relative w-[100vw] h-[100vh] md:max-w-[420px] md:max-h-[740px]">
        {reelsData.map((reel, i) => (
          <div
            key={reel.id}
            className={`absolute inset-0 transition-transform duration-500 ease-out
              ${i === current ? "translate-y-0" : i < current ? "-translate-y-full" : "translate-y-full"}`}
          >
            <video
              ref={(el) => (videoRefs.current[i] = el)}
              src={reel.src}
              className="w-full h-full object-cover"
              loop
              playsInline
              muted={muted}
              onClick={togglePlay}
            />
            {/* username + follow + caption */}
            <div className="absolute bottom-20 left-4 right-24 text-white">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-semibold">@{reel.username}</span>
                <button
                  onClick={() => toggleFollow(reel.username)}
                  className="text-xs bg-white text-black px-3 py-1 rounded-full"
                >
                  {following[reel.username] ? "Following" : "Follow"}
                </button>
              </div>
              <p className="text-sm opacity-95 leading-snug">{reel.caption}</p>
            </div>
            {/* right rail */}
            <div className="absolute bottom-24 right-3 flex flex-col gap-5 items-center text-white">
              <button onClick={() => toggleLike(reel.id)}>
                <Heart
                  size={28}
                  className={likes[reel.id] ? "text-red-500 fill-red-500" : ""}
                />
                <span className="text-[11px] mt-1">
                  {(likes[reel.id] ? reel.likes + 1 : reel.likes).toLocaleString()}
                </span>
              </button>
              <button><MessageCircle size={28} /></button>
              <button><Share2 size={28} /></button>
              <button><MoreVertical size={28} /></button>
            </div>
            {/* bottom-left controls */}
            <div className="absolute bottom-6 left-4 flex gap-3">
              <button onClick={togglePlay} className="p-2 bg-black/50 rounded-full">
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              </button>
              <button onClick={toggleMute} className="p-2 bg-black/50 rounded-full">
                {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
            </div>
            {/* paused overlay */}
            {!isPlaying && i === current && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="p-4 rounded-full bg-black/40">
                  <Play size={36} className="text-white" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
