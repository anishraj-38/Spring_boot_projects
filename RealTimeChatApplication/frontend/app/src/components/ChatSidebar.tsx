import React from 'react';
import { Search, MoreVertical, Phone, Video } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  online: boolean;
  unread?: number;
}

interface ChatSidebarProps {
  contacts: Contact[];
  selectedChat: string;
  onSelectChat: (id: string) => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ contacts, selectedChat, onSelectChat }) => {
  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-800">Messages</h1>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            onClick={() => onSelectChat(contact.id)}
            className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 ${
              selectedChat === contact.id ? 'bg-blue-50 border-blue-100' : ''
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src={contact.avatar}
                  alt={contact.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                {contact.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 truncate">{contact.name}</h3>
                  <span className="text-xs text-gray-500">{contact.timestamp}</span>
                </div>
                <p className="text-sm text-gray-600 truncate">{contact.lastMessage}</p>
              </div>
              
              {contact.unread && (
                <div className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {contact.unread}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;