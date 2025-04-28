import Peer, { DataConnection } from 'peerjs';
import { IPeerService, IConnectionService, ILoggingService, IErrorHandler, IPeerCallbacks } from '../domain/ports';
import { Connection, PeerError } from '../domain/types';

const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 3000;

export class PeerService implements IPeerService {
  private peer: Peer | null = null;
  private reconnectAttempts = 0;
  private isReconnecting = false;
  private callbacks: IPeerCallbacks | null = null;

  constructor(
    private connectionService: IConnectionService,
    private loggingService: ILoggingService,
    private errorHandler: IErrorHandler
  ) {}

  initialize(callbacks: IPeerCallbacks): void {
    this.callbacks = callbacks;
    this.peer = new Peer({
      debug: 3,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' },
          { urls: 'stun:stun3.l.google.com:19302' },
          { urls: 'stun:stun4.l.google.com:19302' },
          {
            urls: 'turn:openrelay.metered.ca:80',
            username: 'openrelayproject',
            credential: 'openrelayproject'
          },
          {
            urls: 'turn:openrelay.metered.ca:443',
            username: 'openrelayproject',
            credential: 'openrelayproject'
          },
          {
            urls: 'stun:openrelay.metered.ca:80'
          }
        ]
      }
    });

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    if (!this.peer) return;

    this.peer.on('open', (id) => {
      this.loggingService.addLog(`Peer opened with ID: ${id}`, 'success');
      this.isReconnecting = false;
      this.reconnectAttempts = 0;
      if (this.callbacks) {
        this.callbacks.onPeerOpen(id);
      }
    });

    this.peer.on('connection', (conn) => {
      this.loggingService.addLog(`Incoming connection from: ${conn.peer}`, 'success');
      this.handleNewConnection(conn);
    });

    this.peer.on('error', (err) => {
      this.errorHandler.handleError(err);
    });
  }

  private handleNewConnection(conn: DataConnection): void {
    const connection: Connection = { id: conn.peer, connection: conn };
    this.connectionService.addConnection(connection);
    
    if (this.callbacks) {
      this.callbacks.onConnectionChange(this.connectionService.getConnections());
    }

    conn.on('data', (data) => {
      this.loggingService.addLog(`Received message from ${conn.peer}: ${data}`);
      if (this.callbacks) {
        this.callbacks.onMessage({
          text: data as string,
          senderId: conn.peer,
          isMine: false
        });
      }
    });

    conn.on('close', () => {
      this.loggingService.addLog(`Connection closed with ${conn.peer}`);
      this.connectionService.removeConnection(conn.peer);
      if (this.callbacks) {
        this.callbacks.onConnectionChange(this.connectionService.getConnections());
      }
    });

    conn.on('error', (err) => {
      this.loggingService.addLog(`Connection error with ${conn.peer}: ${err}`, 'error');
    });
  }

  connect(peerId: string): void {
    if (!this.peer) return;

    const conn = this.peer.connect(peerId, {
      metadata: {
        platform: navigator.platform,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      }
    });

    this.handleNewConnection(conn);
  }

  sendMessage(message: string): void {
    if (!this.peer) return;

    this.connectionService.getConnections().forEach(({ connection }) => {
      this.loggingService.addLog(`Sending message to ${connection.peer}: ${message}`);
      connection.send(message);
    });
  }

  disconnect(): void {
    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }
  }

  getPeerId(): string | null {
    return this.peer?.id || null;
  }

  handleReconnect(forceNewId = false): void {
    if (this.reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      this.loggingService.addLog('Max reconnection attempts reached. Please refresh the page.', 'error');
      return;
    }

    this.isReconnecting = true;
    this.reconnectAttempts += 1;
    this.loggingService.addLog(`Reconnection attempt ${this.reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}`);

    setTimeout(() => {
      if (this.peer) {
        this.loggingService.addLog('Attempting to reconnect...');
        if (forceNewId) {
          this.peer.destroy();
          if (this.callbacks) {
            this.initialize(this.callbacks);
          }
        } else {
          this.peer.reconnect();
        }
      }
    }, RECONNECT_DELAY);
  }
} 