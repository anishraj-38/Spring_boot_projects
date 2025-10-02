import React, { useState } from 'react';
import { Send, Paperclip, Smile, Mic } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <form onSubmit={handleSubmit} className="flex items-center space-x-3">
        <button
          type="button"
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <Paperclip className="w-5 h-5 text-gray-600" />
        </button>
        
        <div className="flex-1 relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
          >
            <Smile className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        
        {message.trim() ? (
          <button
            type="submit"
            className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg"
          >
            <Send className="w-5 h-5" />
          </button>
        ) : (
          <button
            type="button"
            className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
          >
            <Mic className="w-5 h-5 text-gray-600" />
          </button>
        )}
      </form>
    </div>
  );
};

export default ChatInput;