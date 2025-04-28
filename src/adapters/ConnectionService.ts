import { IConnectionService } from '../domain/ports';
import { Connection } from '../domain/types';

export class ConnectionService implements IConnectionService {
  private connections: Connection[] = [];

  addConnection(connection: Connection): void {
    this.connections = [...this.connections, connection];
  }

  removeConnection(peerId: string): void {
    this.connections = this.connections.filter(conn => conn.id !== peerId);
  }

  getConnections(): Connection[] {
    return this.connections;
  }

  hasConnections(): boolean {
    return this.connections.length > 0;
  }
} 