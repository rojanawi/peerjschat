import { DataConnection } from 'peerjs';

export interface Message {
  text: string;
  senderId: string;
  isMine: boolean;
}

export interface LogEntry {
  timestamp: string;
  message: string;
  type: 'info' | 'error' | 'success' | 'warning';
}

export interface Connection {
  id: string;
  connection: DataConnection;
}

export interface PeerError {
  type: string;
  message: string;
}

export type PeerErrorType = 
  | 'browser-incompatible'
  | 'disconnected'
  | 'invalid-id'
  | 'invalid-key'
  | 'network'
  | 'peer-unavailable'
  | 'ssl-unavailable'
  | 'server-error'
  | 'socket-error'
  | 'socket-closed'
  | 'unavailable-id'
  | 'webrtc'; 