// src/services/socketService.ts

import io, { Socket } from 'socket.io-client';

class SocketService {
  public socket: Socket | null = null;

  public connect(token: string) {
    if (!this.socket) {
      this.socket = io('http://localhost:3300', {
        auth: {
          token: token,
        },
        transports: ['websocket'],
      });

      this.socket.on('connect', () => {
        console.log('Connected to Socket.IO server with ID:', this.socket?.id);
      });

      this.socket.on('connect_error', (err) => {
        console.error('Socket connection error:', err);
      });
    }
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log('Disconnected from Socket.IO server');
    }
  }

  public getSocket(): Socket | null {
    return this.socket;
  }
}

const socketService = new SocketService();
export default socketService;
