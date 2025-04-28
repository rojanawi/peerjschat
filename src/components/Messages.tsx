import React from 'react';
import { Message } from '../domain/types';

interface MessagesProps {
  messages: Message[];
}

export const Messages: React.FC<MessagesProps> = ({ messages }) => {
  return (
    <div className="messages">
      {messages.map((msg, index) => (
        <div key={index} className={`message ${msg.isMine ? 'my-message' : ''}`}>
          <div className="message-sender">
            {msg.isMine ? 'You' : `Peer ${msg.senderId.slice(0, 6)}...`}
          </div>
          <div className="message-content">{msg.text}</div>
        </div>
      ))}
    </div>
  );
}; 