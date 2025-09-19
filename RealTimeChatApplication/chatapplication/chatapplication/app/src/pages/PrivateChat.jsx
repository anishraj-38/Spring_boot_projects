import React, { useState, useEffect, useRef } from "react";
import "../styles/PrivateChat.css";

const PrivateChat = ({
  currentUser,
  recipientUser,
  userColor,
  stompClient,
  onClose,
  registerPrivateMessageHandler,
  unregisterPrivateMessageHandler,
}) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const emojis = ["😀", "😂", "❤️", "👍", "😢", "🔥", "🚀", "✨", "😎"];

  useEffect(() => {
    const handler = (privateMessage) => {
      setMessages((prev) => [
        ...prev,
        {
          ...privateMessage,
          timestamp: privateMessage.timestamp || new Date(),
          id: privateMessage.id || Date.now() + Math.random(),
        },
      ]);
    };

    registerPrivateMessageHandler(recipientUser, handler);

    return () => {
      unregisterPrivateMessageHandler(recipientUser);
      clearTimeout(typingTimeoutRef.current);
    };
  }, [recipientUser, registerPrivateMessageHandler, unregisterPrivateMessageHandler]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && stompClient.current && stompClient.current.connected) {
      const privateMessage = {
        sender: currentUser,
        recipient: recipientUser,
        content: message,
        type: "PRIVATE",
        color: userColor,
      };
      stompClient.current.send(
        "/app/chat.privateMessage",
        {},
        JSON.stringify(privateMessage)
      );
      setMessages((prev) => [...prev, privateMessage]);
      setMessage("");
      setShowEmojiPicker(false);
    }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);

    if (stompClient.current && stompClient.current.connected && e.target.value.trim()) {
      stompClient.current.send(
        "/app/chat.privateMessage",
        {},
        JSON.stringify({
          sender: currentUser,
          recipient: recipientUser,
          type: "TYPING",
        })
      );
    }
  };

  const addEmoji = (emoji) => {
    setMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const formatTime = (timestamp) =>
    new Date(timestamp).toLocaleTimeString("en-US", {
      timeZone: "Asia/Kolkata",
      hour12: true,
      hour: "numeric",
      minute: "2-digit",
    });

  return (
    <div className="private-chat-window">
      <div className="private-chat-header">
        <div className="chat-title">
          <div className="chat-avatar">{recipientUser.charAt(0).toUpperCase()}</div>
          <span>{recipientUser}</span>
        </div>
        <button className="close-btn" onClick={onClose} title="Close">
          ✕
        </button>
      </div>

      <div className="private-messages">
        {messages.length === 0 ? (
          <div className="empty-private">
            <div className="empty-icon">💌</div>
            <p>No private messages yet</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`private-message ${
                msg.sender === currentUser ? "own" : "other"
              }`}
            >
              <div
                className="private-avatar"
                style={{ backgroundColor: msg.color || "#007bff" }}
              >
                {msg.sender.charAt(0).toUpperCase()}
              </div>
              <div className="private-content">
                <div className="private-header">
                  <span
                    className="private-sender"
                    style={{ color: msg.color || "#007bff" }}
                  >
                    {msg.sender === currentUser ? "You" : msg.sender}
                  </span>
                  <span className="private-time">{formatTime(msg.timestamp)}</span>
                </div>
                <div className="private-text">{msg.content}</div>
              </div>
            </div>
          ))
        )}

        {isTyping && (
          <div className="typing-indicator">
            <span>{recipientUser} is typing</span>
            <div className="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {showEmojiPicker && (
        <div className="emoji-picker">
          <div className="emoji-grid">
            {emojis.map((emoji) => (
              <button
                key={emoji}
                onClick={() => addEmoji(emoji)}
                className="emoji-btn"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={sendMessage} className="private-input-area">
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="emoji-toggle-btn"
          title="Add emoji"
        >
          😀
        </button>
        <input
          type="text"
          placeholder={`Message ${recipientUser}...`}
          value={message}
          onChange={handleTyping}
          className="private-input"
        />
        <button type="submit" className="send-btn" disabled={!message.trim()}>
          🚀
        </button>
      </form>
    </div>
  );
};

export default PrivateChat;
