import { io, Socket } from 'socket.io-client';
import type { RealTimeEvent, RealTimeEventType } from '@/types';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  private socket: Socket | null = null;
  private eventHandlers: Map<RealTimeEventType, Set<(data: any) => void>> = new Map();

  /**
   * Connect to the socket server
   */
  connect(token: string): void {
    if (this.socket?.connected) {
      console.log('Socket already connected');
      return;
    }

    this.socket = io(SOCKET_URL, {
      auth: {
        token,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    this.setupEventListeners();
  }

  /**
   * Disconnect from the socket server
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.eventHandlers.clear();
    }
  }

  /**
   * Check if socket is connected
   */
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  /**
   * Setup default event listeners
   */
  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    // Listen for real-time events
    this.socket.on('realtime:event', (event: RealTimeEvent) => {
      this.handleRealTimeEvent(event);
    });
  }

  /**
   * Handle real-time events
   */
  private handleRealTimeEvent(event: RealTimeEvent): void {
    const handlers = this.eventHandlers.get(event.type);
    if (handlers) {
      handlers.forEach((handler) => handler(event.data));
    }
  }

  /**
   * Subscribe to a real-time event
   */
  on(eventType: RealTimeEventType, handler: (data: any) => void): void {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, new Set());
    }
    this.eventHandlers.get(eventType)?.add(handler);
  }

  /**
   * Unsubscribe from a real-time event
   */
  off(eventType: RealTimeEventType, handler: (data: any) => void): void {
    const handlers = this.eventHandlers.get(eventType);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.eventHandlers.delete(eventType);
      }
    }
  }

  /**
   * Emit an event to the server
   */
  emit(event: string, data?: any): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn('Socket not connected. Cannot emit event:', event);
    }
  }

  /**
   * Join a room
   */
  joinRoom(room: string): void {
    this.emit('room:join', { room });
  }

  /**
   * Leave a room
   */
  leaveRoom(room: string): void {
    this.emit('room:leave', { room });
  }

  /**
   * Join task room
   */
  joinTaskRoom(taskId: string): void {
    this.joinRoom(`task:${taskId}`);
  }

  /**
   * Leave task room
   */
  leaveTaskRoom(taskId: string): void {
    this.leaveRoom(`task:${taskId}`);
  }

  /**
   * Join team room
   */
  joinTeamRoom(teamId: string): void {
    this.joinRoom(`team:${teamId}`);
  }

  /**
   * Leave team room
   */
  leaveTeamRoom(teamId: string): void {
    this.leaveRoom(`team:${teamId}`);
  }

  /**
   * Join shared list room
   */
  joinSharedListRoom(listId: string): void {
    this.joinRoom(`list:${listId}`);
  }

  /**
   * Leave shared list room
   */
  leaveSharedListRoom(listId: string): void {
    this.leaveRoom(`list:${listId}`);
  }

  /**
   * Send typing indicator
   */
  sendTyping(taskId: string, isTyping: boolean): void {
    this.emit('comment:typing', { taskId, isTyping });
  }

  /**
   * Send user presence
   */
  sendPresence(status: 'online' | 'away' | 'offline'): void {
    this.emit('user:presence', { status });
  }

  /**
   * Request sync
   */
  requestSync(resource: string, resourceId: string): void {
    this.emit('sync:request', { resource, resourceId });
  }
}

export default new SocketService();

