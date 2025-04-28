import { ILoggingService } from '../domain/ports';
import { LogEntry } from '../domain/types';

export class LoggingService implements ILoggingService {
  private logs: LogEntry[] = [];

  addLog(message: string, type: LogEntry['type'] = 'info'): void {
    const timestamp = new Date().toLocaleTimeString();
    this.logs = [...this.logs, { timestamp, message, type }];
  }

  getLogs(): LogEntry[] {
    return this.logs;
  }

  clearLogs(): void {
    this.logs = [];
  }
} 