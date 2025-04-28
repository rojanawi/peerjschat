import { IErrorHandler, ILoggingService } from '../domain/ports';
import { PeerError } from '../domain/types';

export class ErrorHandler implements IErrorHandler {
  constructor(
    private loggingService: ILoggingService,
    private onReconnect: (forceNewId?: boolean) => void
  ) {}

  handleError(error: PeerError): void {
    this.loggingService.addLog(`Peer error: ${error.type} - ${error.message}`, 'error');

    switch (error.type) {
      case 'browser-incompatible':
        this.loggingService.addLog('Your browser does not support WebRTC features. Please use a modern browser.', 'error');
        break;

      case 'disconnected':
        this.loggingService.addLog('Disconnected from server. Attempting to reconnect...', 'error');
        this.onReconnect();
        break;

      case 'invalid-id':
      case 'invalid-key':
        this.loggingService.addLog('Invalid configuration. Please refresh the page.', 'error');
        break;

      case 'network':
        this.loggingService.addLog('Network connection lost. Attempting to reconnect...', 'error');
        this.onReconnect();
        break;

      case 'peer-unavailable':
        this.loggingService.addLog('The peer you are trying to connect to is unavailable.', 'error');
        break;

      case 'ssl-unavailable':
        this.loggingService.addLog('SSL connection unavailable. Please refresh the page.', 'error');
        break;

      case 'server-error':
      case 'socket-error':
      case 'socket-closed':
        this.loggingService.addLog('Server connection error. Attempting to reconnect...', 'error');
        this.onReconnect();
        break;

      case 'unavailable-id':
        this.loggingService.addLog('Your ID is taken. Generating a new ID...', 'error');
        this.onReconnect(true);
        break;

      case 'webrtc':
        this.loggingService.addLog('WebRTC error. Attempting to reconnect...', 'error');
        this.onReconnect();
        break;

      default:
        this.loggingService.addLog(`Unknown error: ${error.type}`, 'error');
        break;
    }
  }
} 