import React, { useState } from "react";
import { formatGeminiAnswer } from "../utils/formatGeminiAnswer";

function GeminiChat() {
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  // Handle sending message + image
  const handleSend = async () => {
    if (!message && !image) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("message", message);
      if (image) {
        const blob = await fetch(image).then((res) => res.blob());
        formData.append("image", blob, "image.png");
      }

      const res = await fetch("https://strym-three.vercel.app/api/chat", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setReply(data.reply || "No reply received.");
    } catch (err) {
      setReply("❌ Error: " + err.message);
      console.error(err);
    }

    setLoading(false);
    setMessage("");
    setImage(null);
  };

  return (
    <div className="flex flex-col w-full mx-auto h-screen p-4 bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <h1 className="text-3xl font-bold text-center mb-6 tracking-wide animate-pulse">
        Ask Strym AI
      </h1>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {/* AI reply */}
        {reply && (
          <div className="flex justify-start">
            <div className="bg-gray-700 p-4 rounded-2xl max-w-xl shadow-lg animate-fade-in">
              <strong className="text-blue-400">Strym AI:</strong>
              <div className="mt-2 whitespace-pre-wrap">
                {formatGeminiAnswer(reply)}
              </div>
            </div>
          </div>
        )}

        {/* User message */}
        {message && (
          <div className="flex justify-end">
            <div className="bg-blue-600 p-4 rounded-2xl max-w-xl shadow-lg animate-fade-in">
              {message}
            </div>
          </div>
        )}

        {/* Image preview */}
        {image && (
          <div className="flex justify-center">
            <div className="relative group">
              <img
                src={image}
                alt="preview"
                className="rounded-2xl w-100 h-60 shadow-lg transition-transform duration-300 transform group-hover:scale-105"
              />
              <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                onClick={() => setImage(null)}
              >
                Remove
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="mt-4 flex flex-col sm:flex-row gap-2 items-center">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type your question..."
          className="flex-1 bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-white"
        />

        {/* Image upload */}
        <label className="flex items-center justify-center px-4 py-3 bg-blue-500 hover:bg-blue-600 rounded-2xl cursor-pointer transition-all duration-200">
          <span className="text-white font-semibold">Upload Image</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={loading}
          className={`bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-2xl transition-all duration-200 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default GeminiChat;
