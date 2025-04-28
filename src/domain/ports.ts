import { Message, Connection, LogEntry, PeerError } from './types';

export interface IPeerCallbacks {
  onPeerOpen: (id: string) => void;
  onMessage: (message: Message) => void;
  onConnectionChange: (connections: Connection[]) => void;
}

export interface IPeerService {
  initialize(callbacks: IPeerCallbacks): void;
  connect(peerId: string): void;
  sendMessage(message: string): void;
  disconnect(): void;
  getPeerId(): string | null;
}

export interface IMessageService {
  addMessage(message: Message): void;
  getMessages(): Message[];
  clearMessages(): void;
}

export interface IConnectionService {
  addConnection(connection: Connection): void;
  removeConnection(peerId: string): void;
  getConnections(): Connection[];
  hasConnections(): boolean;
}

export interface ILoggingService {
  addLog(message: string, type?: LogEntry['type']): void;
  getLogs(): LogEntry[];
  clearLogs(): void;
}

export interface IErrorHandler {
  handleError(error: PeerError): void;
}

export interface IChatState {
  peerId: string;
  remotePeerId: string;
  messages: Message[];
  connections: Connection[];
  logs: LogEntry[];
  isConnecting: boolean;
  isReconnecting: boolean;
  reconnectAttempts: number;
  showLogs: boolean;
} 