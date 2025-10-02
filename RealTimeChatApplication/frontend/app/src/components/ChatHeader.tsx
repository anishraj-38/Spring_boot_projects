import React from 'react';
import { Phone, Video, MoreVertical } from 'lucide-react';

interface ChatHeaderProps {
  contact: {
    name: string;
    avatar: string;
    online: boolean;
    lastSeen?: string;
  } | null;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ contact }) => {
  if (!contact) {
    return (
      <div className="h-16 border-b border-gray-200 bg-white flex items-center justify-center">
        <p className="text-gray-500">Select a conversation to start chatting</p>
      </div>
    );
  }

  return (
    <div className="h-16 border-b border-gray-200 bg-white px-6 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <img
            src={contact.avatar}
            alt={contact.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          {contact.online && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          )}
        </div>
        <div>
          <h2 className="font-semibold text-gray-900">{contact.name}</h2>
          <p className="text-sm text-gray-500">
            {contact.online ? 'Active now' : contact.lastSeen || 'Offline'}
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <Phone className="w-5 h-5 text-gray-600" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <Video className="w-5 h-5 text-gray-600" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <MoreVertical className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;