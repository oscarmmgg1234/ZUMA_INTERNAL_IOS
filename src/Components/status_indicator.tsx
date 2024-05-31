import React, {useState, useEffect, useRef} from 'react';
import StatusDisplay from './status_display';

export default function OnlineStatusIndicator(props: any) {
  const wsRef = useRef<WebSocket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<boolean>(false);

  useEffect(() => {
    const connectWebSocket = (): Promise<boolean> => {
      return new Promise((resolve, reject) => {
        const webSocket = new WebSocket('ws://192.168.1.176:3005');

        webSocket.onopen = () => {
          console.log('WebSocket connected');
          wsRef.current = webSocket; // Set WebSocket instance using ref
          setConnectionStatus(true);
          resolve(true);
        };

        webSocket.onerror = error => {
          console.error('WebSocket error:', error);
          setConnectionStatus(false);
          reject(new Error('WebSocket connection failed'));
        };

        webSocket.onclose = () => {
          console.log('WebSocket disconnected');
          setConnectionStatus(false);
          wsRef.current = null; // Clear WebSocket instance
          attemptReconnect(); // Remove the retries argument to keep trying indefinitely
        };
      });
    };

    const attemptReconnect = (delay: number = 300) => {
      setTimeout(() => {
        connectWebSocket()
          .then(() => console.log('WebSocket reconnected'))
          .catch(() => attemptReconnect(delay)); // Keep retrying every second on catch
      }, delay);
    };

    // Call connectWebSocket directly inside useEffect
    connectWebSocket().catch(error => console.error(error));

    // Cleanup function
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return <StatusDisplay online={connectionStatus} />;
}
