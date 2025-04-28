import React, { useState } from 'react';
import { Messages } from './components/Messages';
import { Logs } from './components/Logs';
import { ConnectionInfo } from './components/ConnectionInfo';
import { usePeerChat } from './hooks/usePeerChat';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const { state, setState, actions } = usePeerChat();

  const handleSendMessage = () => {
    if (!message.trim()) return;
    actions.sendMessage(message);
    setMessage('');
  };

  return (
    <div className="chat-container">
      <h1>PeerJS Chat</h1>
      
      {state.isReconnecting && (
        <div className="reconnecting-banner">
          Attempting to reconnect... ({state.reconnectAttempts}/5)
        </div>
      )}

      <ConnectionInfo
        peerId={state.peerId}
        connections={state.connections}
        onCopyId={actions.copyToClipboard}
        onCopyLink={actions.copyToClipboard}
      />

      {!state.connections.length ? (
        <div className="input-group">
          <input
            type="text"
            value={state.remotePeerId}
            onChange={(e) => setState(prev => ({ ...prev, remotePeerId: e.target.value }))}
            placeholder="Enter peer ID to connect"
            disabled={state.isConnecting}
          />
          <button 
            onClick={() => actions.connectToPeer(state.remotePeerId)}
            disabled={state.isConnecting || !state.remotePeerId}
            className={state.isConnecting ? 'connecting' : ''}
          >
            {state.isConnecting ? 'Connecting...' : 'Connect'}
          </button>
        </div>
      ) : (
        <>
          <Messages messages={state.messages} />
          
          <div className="input-group">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </>
      )}

      <Logs
        logs={state.logs}
        showLogs={state.showLogs}
        onToggle={actions.toggleLogs}
      />
    </div>
  );
}

export default App;
