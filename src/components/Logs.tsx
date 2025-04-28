import React, { useRef, useEffect } from 'react';
import { LogEntry } from '../domain/types';

interface LogsProps {
  logs: LogEntry[];
  showLogs: boolean;
  onToggle: () => void;
}

export const Logs: React.FC<LogsProps> = ({ logs, showLogs, onToggle }) => {
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showLogs) {
      logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, showLogs]);

  return (
    <div className="logs-section">
      <button 
        className="toggle-logs"
        onClick={onToggle}
      >
        {showLogs ? 'Hide Logs' : 'Show Logs'}
      </button>
      
      {showLogs && (
        <div className="logs-container">
          {logs.map((log, index) => (
            <div key={index} className={`log-entry ${log.type}`}>
              <span className="timestamp">[{log.timestamp}]</span>
              <span className="message">{log.message}</span>
            </div>
          ))}
          <div ref={logsEndRef} />
        </div>
      )}
    </div>
  );
}; 