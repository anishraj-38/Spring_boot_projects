import React from 'react';
import { Check, CheckCheck } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  timestamp: string;
  sender: 'me' | 'other';
  status?: 'sent' | 'delivered' | 'read';
}

interface ChatMessagesProps {
  messages: Message[];
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-2xl ${
              message.sender === 'me'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white ml-12'
                : 'bg-white border border-gray-200 text-gray-900 mr-12 shadow-sm'
            } transform transition-all duration-200 hover:scale-[1.02]`}
          >
            <p className="text-sm leading-relaxed">{message.text}</p>
            <div
              className={`flex items-center justify-end mt-2 space-x-1 ${
                message.sender === 'me' ? 'text-blue-100' : 'text-gray-500'
              }`}
            >
              <span className="text-xs">{message.timestamp}</span>
              {message.sender === 'me' && (
                <div className="flex">
                  {message.status === 'sent' && <Check className="w-3 h-3" />}
                  {message.status === 'delivered' && <CheckCheck className="w-3 h-3" />}
                  {message.status === 'read' && <CheckCheck className="w-3 h-3 text-blue-200" />}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatMessages;