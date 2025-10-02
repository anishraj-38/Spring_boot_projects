import React, { useState } from 'react';
import ChatSidebar from './ChatSidebar';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';

interface Message {
  id: string;
  text: string;
  timestamp: string;
  sender: 'me' | 'other';
  status?: 'sent' | 'delivered' | 'read';
}

interface Contact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  online: boolean;
  unread?: number;
}

// Mock data
const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=150',
    lastMessage: 'Hey! How are you doing today?',
    timestamp: '2:30 PM',
    online: true,
    unread: 2,
  },
  {
    id: '2',
    name: 'Alex Chen',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?w=150',
    lastMessage: 'Thanks for the help with the project!',
    timestamp: '1:15 PM',
    online: false,
    unread: 0,
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=150',
    lastMessage: 'See you at the meeting tomorrow',
    timestamp: '11:45 AM',
    online: true,
    unread: 1,
  },
  {
    id: '4',
    name: 'Michael Brown',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=150',
    lastMessage: 'The documents look great!',
    timestamp: 'Yesterday',
    online: false,
    unread: 0,
  },
];

const mockMessages: Message[] = [
  {
    id: '1',
    text: 'Hey! How are you doing today?',
    timestamp: '2:28 PM',
    sender: 'other',
  },
  {
    id: '2',
    text: 'I\'m doing great! Just finished up with work. How about you?',
    timestamp: '2:29 PM',
    sender: 'me',
    status: 'read',
  },
  {
    id: '3',
    text: 'That\'s awesome! I\'m just getting ready for the weekend. Any fun plans?',
    timestamp: '2:30 PM',
    sender: 'other',
  },
  {
    id: '4',
    text: 'Actually yes! Planning to go hiking with some friends. The weather looks perfect for it.',
    timestamp: '2:30 PM',
    sender: 'me',
    status: 'delivered',
  },
];

const ChatApp: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState('1');
  const [messages, setMessages] = useState<Message[]>(mockMessages);

  const selectedContact = mockContacts.find(contact => contact.id === selectedChat);

  const handleSendMessage = (messageText: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sender: 'me',
      status: 'sent',
    };
    setMessages([...messages, newMessage]);
  };

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Sidebar */}
      <ChatSidebar
        contacts={mockContacts}
        selectedChat={selectedChat}
        onSelectChat={setSelectedChat}
      />
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <ChatHeader contact={selectedContact || null} />
        <ChatMessages messages={messages} />
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default ChatApp;