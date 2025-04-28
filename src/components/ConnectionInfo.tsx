import React from 'react';
import { Connection } from '../domain/types';

interface ConnectionInfoProps {
  peerId: string;
  connections: Connection[];
  onCopyId: (id: string) => void;
  onCopyLink: (link: string) => void;
}

export const ConnectionInfo: React.FC<ConnectionInfoProps> = ({
  peerId,
  connections,
  onCopyId,
  onCopyLink
}) => {
  return (
    <>
      <div className="peer-id-container">
        <p>Your ID: {peerId}</p>
        {peerId && (
          <>
            <button 
              className="copy-button"
              onClick={() => onCopyId(peerId)}
            >
              Copy ID
            </button>
            <button 
              className="copy-button"
              onClick={() => {
                const url = `${window.location.origin}${window.location.pathname}?peerId=${peerId}`;
                onCopyLink(url);
              }}
            >
              Copy Link
            </button>
          </>
        )}
      </div>
      
      <div className="connections-list">
        <h3>Connected Peers ({connections.length})</h3>
        {connections.map(({ id }) => (
          <div key={id} className="connection-item">
            {id}
          </div>
        ))}
      </div>
    </>
  );
}; 