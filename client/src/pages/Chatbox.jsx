import React, { useEffect, useRef, useState } from 'react';
import { ImageIcon, SendHorizonal } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useAuth, useUser } from '@clerk/clerk-react';
import { resetMessages, addMessage } from '../../features/messages/messageSlice.js';
import { fetchMessages } from '../../features/messages/messageSlice.js';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { fetchConnections } from '../../features/connections/connectionSlice';

const Chatbox = () => {
  const connections = useSelector((state) => state.connections.connections);
  const { messages } = useSelector((state) => state.messages);
  const { userId } = useParams();
  const { getToken } = useAuth();
  const { user: loggedInUser } = useUser();
  const dispatch = useDispatch();

  const [text, setText] = useState('');
  const [user, setUser] = useState(null);
  const [image, setImage] = useState(null);
  const messageEndRef = useRef(null);

  // Fetch messages
  const fetchUserMessages = async () => {
    try {
      const token = await getToken();
      await dispatch(fetchMessages({ token, userId })).unwrap();
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      toast.error(error.message);
    }
  };

  // Send message
  const sendMessage = async () => {
    try {
      if (!text && !image) {
        console.warn('Cannot send empty message');
        return;
      }
      if (!userId) {
        console.error('No userId to send message to!');
        return;
      }

      const token = await getToken();
      const formData = new FormData();
      formData.append('to_user_id', userId);
      formData.append('text', text);
      if (image) formData.append('image', image);

      console.log('Sending message:', { to_user_id: userId, text, image });

      const { data } = await api.post('/api/message/send', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        console.log('Message sent successfully:', data.message);
        setText('');
        setImage(null);
        dispatch(addMessage(data.message));
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(error.message);
    }
  };

  // Load messages on mount
  useEffect(() => {
    if (userId) fetchUserMessages();
    return () => dispatch(resetMessages());
  }, [userId]);

  // Load user from connections or backend
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await getToken();
        if (!connections || connections.length === 0) {
          await dispatch(fetchConnections(token)).unwrap();
        }

        let selectedUser = connections.find((c) => String(c._id) === String(userId));
        if (!selectedUser) {
          const { data } = await api.get(`/api/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (data.success) selectedUser = data.user;
        }

        if (!selectedUser) {
          console.warn('User not found for chat');
        }

        setUser(selectedUser || null);
      } catch (err) {
        console.error('Failed to load chat user:', err);
        toast.error('Failed to load chat');
      }
    };

    if (userId) loadUser();
  }, [connections, userId, dispatch, getToken]);

  // Scroll to latest message
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // SSE for real-time messages
  useEffect(() => {
    let eventSource;
    const initSSE = async () => {
      const token = await getToken();
      eventSource = new EventSource(`/api/message/sse/${loggedInUser.id}?token=${token}`);

      eventSource.onmessage = (event) => {
        try {
          const newMessage = JSON.parse(event.data);
          dispatch(addMessage(newMessage));
        } catch (e) {
          console.error('SSE parse error:', e);
        }
      };

      eventSource.onerror = (err) => {
        console.error('SSE error:', err);
        eventSource.close();
      };
    };

    if (loggedInUser?.id) initSSE();
    return () => eventSource?.close();
  }, [loggedInUser, dispatch, getToken]);

  if (!user) return <p className="text-center mt-10 text-gray-500">Loading chat...</p>;

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center gap-2 p-2 md:px-10 xl:pl-42 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-300">
        <img src={user.profile_picture} alt="" className="h-8 w-8 rounded-full" />
        <div>
          <p className="font-medium">{user.full_name}</p>
          <p className="text-sm text-gray-500 -mt-1.5">{user.username}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="p-5 md:px-10 h-full overflow-y-scroll no-scrollbar">
        <div className="space-y-4 max-w-4xl mx-auto">
          {messages && messages.length > 0 ? (
            messages
              .filter(Boolean)
              .sort((a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0))
              .map((message, index) => {
                const isOwnMessage =
                  String(message.from_user_id?._id || message.from_user_id) === String(loggedInUser.id);
                return (
                  <div
                    key={message._id || index}
                    className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`p-2 text-sm max-w-sm bg-white text-slate-700 rounded-lg shadow ${
                        isOwnMessage ? 'rounded-br-none' : 'rounded-bl-none'
                      }`}
                    >
                      {message.message_type === 'image' && message.media_url && (
                        <img
                          src={message.media_url}
                          alt="message"
                          className="w-full max-w-sm rounded-lg mb-1"
                        />
                      )}
                      {message.text && <p>{message.text}</p>}
                    </div>
                  </div>
                );
              })
          ) : (
            <p className="text-center text-gray-400">No messages yet</p>
          )}
          <div ref={messageEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="px-4">
        <div className="flex items-center gap-3 pl-5 p-1.5 bg-white w-full max-w-xl mx-auto border border-gray-200 shadow rounded-full mb-5">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 outline-none text-slate-700"
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            onChange={(e) => setText(e.target.value)}
            value={text}
          />

          <label htmlFor="image">
            {image ? (
              <img src={URL.createObjectURL(image)} alt="" className="h-8 rounded" />
            ) : (
              <ImageIcon className="h-6 w-6 text-gray-400 cursor-pointer" />
            )}
            <input
              type="file"
              id="image"
              accept="image/*"
              hidden
              onChange={(e) => setImage(e.target.files[0])}
            />
          </label>

          <button
            onClick={sendMessage}
            className="bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-800 active:scale-95 p-2 cursor-pointer rounded-full text-white"
          >
            <SendHorizonal size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbox;
