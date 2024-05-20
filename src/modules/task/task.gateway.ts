import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: 'http://127.0.0.1:5500',
    credentials: true,
  },
})
export class TaskGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private clients: Map<string, Socket> = new Map();

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.clients.set(userId, client);
      console.log(`Client connected ->  ${client.id}, UserID: ${userId}`);
    }
  }

  handleDisconnect(client: Socket) {
    for (const [userId, socket] of this.clients.entries()) {
      if (socket.id === client.id) {
        this.clients.delete(userId);
        console.log(
          `Client  disconnected -> : ${client.id}, UserID: ${userId}`,
        );
        break;
      }
    }
  }

  @SubscribeMessage('createTask')
  handleCreateTask(client: Socket, payload: any): void {
    console.log('Task created:', payload);
    this.server.emit('taskCreated', payload);
  }

  emitTaskToUser(userId: string, task: any) {
    const client = this.clients.get(userId);
    if (client) {
      client.emit('taskCreated', task);
    }
  }
}
