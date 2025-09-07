import React, { useState } from "react";
import { formatGeminiAnswer } from "../utils/formatGeminiAnswer";


function GeminiChat() {
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSend = async () => {
    if (!message && !image) return;
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, image }),
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
    <div  className="max-w-500 p-2">
      <h1>Ask Gemini</h1>

      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        placeholder="Type your question..."
        style={{ width: "100%", padding: 8, marginBottom: 10 }}
      />

      <input type="file" accept="image/*" onChange={handleImageChange} />

      {image && (
        <div style={{ marginTop: 10 }}>
          <img src={image} alt="preview" style={{ maxWidth: "100%", borderRadius: 8 }} />
        </div>
      )}

      <button
        onClick={handleSend}
        disabled={loading}
        style={{ marginTop: 10, padding: "8px 16px" }}
      >
        {loading ? "Sending..." : "Send"}
      </button>

      {/* Render formatted reply */}
      {reply && (
        <div style={{ marginTop: 20, background: "#f4f4f4", padding: 10, borderRadius: 6 }}>
          <strong>Gemini:</strong>
          {formatGeminiAnswer(reply)}
        </div>
      )}
    </div>
  );
}

export default GeminiChat;
