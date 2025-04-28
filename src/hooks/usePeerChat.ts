import { useState, useEffect, useRef } from 'react';
import { PeerService } from '../adapters/PeerService';
import { MessageService } from '../adapters/MessageService';
import { ConnectionService } from '../adapters/ConnectionService';
import { LoggingService } from '../adapters/LoggingService';
import { ErrorHandler } from '../adapters/ErrorHandler';
import { IChatState } from '../domain/ports';
import { Message } from '../domain/types';

export const usePeerChat = () => {
  const [state, setState] = useState<IChatState>({
    peerId: '',
    remotePeerId: '',
    messages: [],
    connections: [],
    logs: [],
    isConnecting: false,
    isReconnecting: false,
    reconnectAttempts: 0,
    showLogs: false
  });

  const messageService = useRef(new MessageService());
  const connectionService = useRef(new ConnectionService());
  const loggingService = useRef(new LoggingService());
  const errorHandler = useRef(new ErrorHandler(
    loggingService.current,
    (forceNewId) => peerService.current?.handleReconnect(forceNewId)
  ));
  const peerService = useRef(new PeerService(
    connectionService.current,
    loggingService.current,
    errorHandler.current
  ));

  const connectToPeer = (remotePeerId: string) => {
    setState(prev => ({ ...prev, isConnecting: true }));
    peerService.current.connect(remotePeerId);
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const message: Message = {
      text,
      senderId: state.peerId,
      isMine: true
    };

    messageService.current.addMessage(message);
    peerService.current.sendMessage(text);
    setState(prev => ({ ...prev, messages: messageService.current.getMessages() }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    loggingService.current.addLog('Copied to clipboard', 'success');
    setState(prev => ({ ...prev, logs: loggingService.current.getLogs() }));
  };

  const toggleLogs = () => {
    setState(prev => ({ ...prev, showLogs: !prev.showLogs }));
  };

  const actions = {
    connectToPeer,
    sendMessage,
    copyToClipboard,
    toggleLogs
  };

  useEffect(() => {
    // Check for peerId in URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const peerIdFromUrl = urlParams.get('peerId');
    if (peerIdFromUrl) {
      setState(prev => ({ ...prev, remotePeerId: peerIdFromUrl }));
    }

    peerService.current.initialize({
      onPeerOpen: (id) => {
        setState(prev => ({ ...prev, peerId: id }));
        // If we have a peerId from URL, connect to it
        if (peerIdFromUrl) {
          actions.connectToPeer(peerIdFromUrl);
        }
      },
      onMessage: (message) => {
        messageService.current.addMessage(message);
        setState(prev => ({ ...prev, messages: messageService.current.getMessages() }));
      },
      onConnectionChange: (connections) => {
        setState(prev => ({ 
          ...prev, 
          connections,
          isConnecting: false // Reset connecting state when connections change
        }));
      }
    });

    // Set up an interval to sync logs with state
    const logSyncInterval = setInterval(() => {
      setState(prev => ({ ...prev, logs: loggingService.current.getLogs() }));
    }, 100);

    return () => {
      peerService.current.disconnect();
      clearInterval(logSyncInterval);
    };
  }, []);

  return {
    state,
    setState,
    actions
  };
}; 