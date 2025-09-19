import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { authService } from '../services/authService';
import PrivateChat from './PrivateChat';
import '../styles/ChatArea.css';

const ChatArea = () => {
    const navigate = useNavigate();
    const currentUser = authService.getCurrentUser();

    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
            return;
        }
    }, [currentUser, navigate]);

    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [onlineUsers, setOnlineUsers] = useState(new Set());
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [isTyping, setIsTyping] = useState('');
    const [privateChats, setPrivateChats] = useState(new Map());
    const [unreadMessages, setUnreadMessages] = useState(new Map());
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState('connecting');
    const [showSettings, setShowSettings] = useState(false);
    const [darkMode, setDarkMode] = useState(true);

    const privateMessageHandlers = useRef(new Map());
    const stompClient = useRef(null);
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    const emojis = ['😀', '😂', '❤️', '👍', '👎', '😢', '😮', '😡', '🎉', '🔥', '😎', '⭐', '✨', '💯', '🚀', '💡'];

    if (!currentUser) {
        return null;
    }

    const { username, color: userColor } = currentUser;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const registerPrivateMessageHandler = useCallback((otherUser, handler) => {
        privateMessageHandlers.current.set(otherUser, handler);
    }, []);

    const unregisterPrivateMessageHandler = useCallback((otherUser) => {
        privateMessageHandlers.current.delete(otherUser);
    }, []);

    useEffect(() => {
        let reconnectInterval;
        const connectAndFetch = async () => {
            if (!username) return;

            setConnectionStatus('connecting');
            setOnlineUsers(prev => {
                const newSet = new Set(prev);
                newSet.add(username);
                return newSet;
            });

            const socket = new SockJS('http://localhost:8080/ws');
            stompClient.current = Stomp.over(socket);

            stompClient.current.connect({
                'client-id': username,
                'session-id': Date.now().toString(),
                'username': username
            }, (frame) => {
                clearInterval(reconnectInterval);
                setConnectionStatus('connected');

                const publicSub = stompClient.current.subscribe('/topic/public', (msg) => {
                    const chatMessage = JSON.parse(msg.body);

                    setOnlineUsers(prev => {
                        const newUsers = new Set(prev);
                        if (chatMessage.type === 'JOIN') {
                            newUsers.add(chatMessage.sender);
                        } else if (chatMessage.type === 'LEAVE') {
                            newUsers.delete(chatMessage.sender);
                        }
                        return newUsers;
                    });

                    if (chatMessage.type === 'TYPING') {
                        setIsTyping(chatMessage.sender);
                        clearTimeout(typingTimeoutRef.current);
                        typingTimeoutRef.current = setTimeout(() => {
                            setIsTyping('');
                        }, 2000);
                        return;
                    }

                    setMessages(prev => [...prev, {
                        ...chatMessage,
                        timestamp: chatMessage.timestamp || new Date(),
                        id: chatMessage.id || (Date.now() + Math.random())
                    }]);
                });

                const privateSub = stompClient.current.subscribe(`/user/${username}/queue/private`, (msg) => {
                    const privateMessage = JSON.parse(msg.body);
                    const otherUser = privateMessage.sender === username ? privateMessage.recipient : privateMessage.sender;
                    const handler = privateMessageHandlers.current.get(otherUser);

                    if (handler) {
                        try {
                            handler(privateMessage);
                        } catch (error) {
                            console.error('Error calling handler:', error);
                        }
                    } else if (privateMessage.recipient === username) {
                        setUnreadMessages(prev => {
                            const newUnread = new Map(prev);
                            const currentCount = newUnread.get(otherUser) || 0;
                            newUnread.set(otherUser, currentCount + 1);
                            return newUnread;
                        });
                    }
                });

                stompClient.current.send("/app/chat.addUser", {}, JSON.stringify({
                    sender: username,
                    type: 'JOIN',
                    color: userColor
                }));

                authService.getOnlineUsers()
                    .then(data => {
                        const fetchedUsers = Object.keys(data);
                        setOnlineUsers(prev => {
                            const mergedSet = new Set(prev);
                            fetchedUsers.forEach(user => mergedSet.add(user));
                            mergedSet.add(username);
                            return mergedSet;
                        });
                    })
                    .catch(error => {
                        console.error('Error fetching initial online users:', error);
                    });

            }, (error) => {
                console.error('STOMP connection error:', error);
                setConnectionStatus('disconnected');
                if (!reconnectInterval) {
                    reconnectInterval = setInterval(() => {
                        connectAndFetch();
                    }, 5000);
                }
            });
        };

        connectAndFetch();

        return () => {
            if (stompClient.current && stompClient.current.connected) {
                stompClient.current.disconnect();
            }
            clearTimeout(typingTimeoutRef.current);
            clearInterval(reconnectInterval);
        };
    }, [username, userColor, registerPrivateMessageHandler, unregisterPrivateMessageHandler]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const openPrivateChat = (otherUser) => {
        if (otherUser === username) return;

        setPrivateChats(prev => {
            const newChats = new Map(prev);
            newChats.set(otherUser, true);
            return newChats;
        });

        setUnreadMessages(prev => {
            const newUnread = new Map(prev);
            newUnread.delete(otherUser);
            return newUnread;
        });
    };

    const closePrivateChat = (otherUser) => {
        setPrivateChats(prev => {
            const newChats = new Map(prev);
            newChats.delete(otherUser);
            return newChats;
        });
        unregisterPrivateMessageHandler(otherUser);
    };

    const sendMessage = (e) => {
        e.preventDefault();
        if (message.trim() && stompClient.current && stompClient.current.connected) {
            const chatMessage = {
                sender: username,
                content: message,
                type: 'CHAT',
                color: userColor
            };

            stompClient.current.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
            setMessage('');
            setShowEmojiPicker(false);
        }
    };

    const handleTyping = (e) => {
        setMessage(e.target.value);

        if (stompClient.current && stompClient.current.connected && e.target.value.trim()) {
            stompClient.current.send("/app/chat.sendMessage", {}, JSON.stringify({
                sender: username,
                type: 'TYPING'
            }));
        }
    };

    const addEmoji = (emoji) => {
        setMessage(prev => prev + emoji);
        setShowEmojiPicker(false);
    };

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString('en-US', {
            timeZone: 'Asia/Kolkata',
            hour12: true,
            hour: 'numeric',
            minute: '2-digit'
        });
    };

    const handleDisconnect = async () => {
        try {
            if (stompClient.current && stompClient.current.connected) {
                stompClient.current.send("/app/chat.removeUser", {}, JSON.stringify({
                    sender: username,
                    type: 'LEAVE'
                }));
            }
            await authService.logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
            navigate('/login');
        }
    };

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    const getConnectionStatusIcon = () => {
        switch(connectionStatus) {
            case 'connected': return '🟢';
            case 'connecting': return '🟡';
            case 'disconnected': return '🔴';
            default: return '⚪';
        }
    };

    const clearChat = () => {
        setMessages([]);
    };

    return (
        <div className={`chat-container ${darkMode ? 'dark' : 'light'}`}>
            <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
                <div className="sidebar-header">
                    <div className="sidebar-title">
                        <div className="app-icon">💬</div>
                        {!sidebarCollapsed && <h3>ChatSphere</h3>}
                    </div>
                    <button 
                        className="sidebar-toggle"
                        onClick={toggleSidebar}
                        title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        {sidebarCollapsed ? '→' : '←'}
                    </button>
                </div>

                <div className="connection-status">
                    <div className="status-indicator">
                        <span className="status-icon">{getConnectionStatusIcon()}</span>
                        {!sidebarCollapsed && (
                            <span className="status-text">{connectionStatus}</span>
                        )}
                    </div>
                </div>

                <div className="users-section">
                    {!sidebarCollapsed && (
                        <div className="section-header">
                            <h4>Online Users ({onlineUsers.size})</h4>
                        </div>
                    )}
                    <div className="users-list">
                        {Array.from(onlineUsers).map(user => (
                            <div
                                key={user}
                                className={`user-item ${user === username ? 'current-user' : ''}`}
                                onClick={() => openPrivateChat(user)}
                                title={sidebarCollapsed ? user : ''}
                            >
                                <div className="user-avatar" style={{ backgroundColor: user === username ? userColor : '#007bff' }}>
                                    {user.charAt(0).toUpperCase()}
                                </div>
                                {!sidebarCollapsed && (
                                    <>
                                        <div className="user-info">
                                            <span className="username">{user}</span>
                                            {user === username && <span className="you-label">(You)</span>}
                                        </div>
                                        {unreadMessages.has(user) && (
                                            <span className="unread-badge">{unreadMessages.get(user)}</span>
                                        )}
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="sidebar-footer">
                    <button 
                        className="settings-btn"
                        onClick={() => setShowSettings(!showSettings)}
                        title="Settings"
                    >
                        ⚙️
                    </button>
                    <button 
                        className="logout-btn"
                        onClick={handleDisconnect}
                        title="Logout"
                    >
                        🚪
                    </button>
                </div>
            </div>

            <div className="main-chat">
                <div className="chat-header">
                    <div className="header-left">
                        <h2>General Chat</h2>
                        <p>Welcome back, <span className="username-highlight">{username}</span>!</p>
                    </div>
                    <div className="header-right">
                        <button 
                            className="header-btn"
                            onClick={clearChat}
                            title="Clear chat"
                        >
                            🗑️
                        </button>
                        <button 
                            className="header-btn"
                            onClick={() => setDarkMode(!darkMode)}
                            title="Toggle theme"
                        >
                            {darkMode ? '☀️' : '🌙'}
                        </button>
                    </div>
                </div>

                <div className="messages-container">
                    <div className="messages-wrapper">
                        {messages.length === 0 ? (
                            <div className="empty-chat">
                                <div className="empty-icon">💬</div>
                                <h3>No messages yet</h3>
                                <p>Start a conversation to break the ice!</p>
                            </div>
                        ) : (
                            messages.map((msg) => (
                                <div key={msg.id} className={`message-wrapper ${msg.type.toLowerCase()}`}>
                                    {msg.type === 'JOIN' && (
                                        <div className="system-message join">
                                            <div className="system-icon">👋</div>
                                            <span>{msg.sender} joined the chat</span>
                                        </div>
                                    )}
                                    {msg.type === 'LEAVE' && (
                                        <div className="system-message leave">
                                            <div className="system-icon">👋</div>
                                            <span>{msg.sender} left the chat</span>
                                        </div>
                                    )}
                                    {msg.type === 'CHAT' && (
                                        <div className={`chat-message ${msg.sender === username ? 'own-message' : 'other-message'}`}>
                                            <div className="message-avatar" style={{ backgroundColor: msg.color || '#007bff' }}>
                                                {msg.sender.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="message-content">
                                                <div className="message-header">
                                                    <span className="sender-name" style={{ color: msg.color || '#007bff' }}>
                                                        {msg.sender === username ? 'You' : msg.sender}
                                                    </span>
                                                    <span className="message-time">{formatTime(msg.timestamp)}</span>
                                                </div>
                                                <div className="message-text">{msg.content}</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}

                        {isTyping && isTyping !== username && (
                            <div className="typing-indicator">
                                <div className="typing-avatar">
                                    {isTyping.charAt(0).toUpperCase()}
                                </div>
                                <div className="typing-content">
                                    <span className="typing-text">{isTyping} is typing</span>
                                    <div className="typing-dots">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>
                </div>

                <div className="input-area">
                    {showEmojiPicker && (
                        <div className="emoji-picker">
                            <div className="emoji-grid">
                                {emojis.map(emoji => (
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

                    <form onSubmit={sendMessage} className="message-form">
                        <button
                            type="button"
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            className="emoji-toggle-btn"
                            title="Add emoji"
                        >
                            😀
                        </button>
                        <div className="input-wrapper">
                            <input
                                type="text"
                                placeholder="Type your message..."
                                value={message}
                                onChange={handleTyping}
                                className="message-input"
                                maxLength={500}
                                disabled={connectionStatus !== 'connected'}
                            />
                            <div className="input-actions">
                                <span className="char-counter">{message.length}/500</span>
                            </div>
                        </div>
                        <button 
                            type="submit" 
                            disabled={!message.trim() || connectionStatus !== 'connected'} 
                            className="send-btn"
                            title="Send message"
                        >
                            <span className="send-icon">🚀</span>
                        </button>
                    </form>
                </div>
            </div>

            {Array.from(privateChats.keys()).map(otherUser => (
                <PrivateChat
                    key={otherUser}
                    currentUser={username}
                    recipientUser={otherUser}
                    userColor={userColor}
                    stompClient={stompClient}
                    onClose={() => closePrivateChat(otherUser)}
                    registerPrivateMessageHandler={registerPrivateMessageHandler}
                    unregisterPrivateMessageHandler={unregisterPrivateMessageHandler}
                />
            ))}

            {showSettings && (
                <div className="settings-modal">
                    <div className="settings-content">
                        <div className="settings-header">
                            <h3>Settings</h3>
                            <button 
                                onClick={() => setShowSettings(false)}
                                className="close-btn"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="settings-body">
                            <div className="setting-item">
                                <label>Dark Mode</label>
                                <button 
                                    className={`toggle-btn ${darkMode ? 'active' : ''}`}
                                    onClick={() => setDarkMode(!darkMode)}
                                >
                                    {darkMode ? '🌙' : '☀️'}
                                </button>
                            </div>
                            <div className="setting-item">
                                <label>User Color</label>
                                <div className="color-picker">
                                    <div 
                                        className="current-color" 
                                        style={{ backgroundColor: userColor }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatArea;