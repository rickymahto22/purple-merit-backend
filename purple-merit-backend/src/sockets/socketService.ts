import { Server, Socket } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { redisClient } from '../config/redis';

// Duplicate clients for Pub/Sub
const pubClient = redisClient.duplicate();
const subClient = redisClient.duplicate();

export const initSockets = (httpServer: any) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  // FIX: Removed the Promise.all(.connect()) block.
  // ioredis handles the connection automatically.
  io.adapter(createAdapter(pubClient, subClient));
  console.log('✅ Redis Adapter attached');

  io.on('connection', (socket: Socket) => {
    console.log(`🔌 New User Connected: ${socket.id}`);

    // Join Project Room
    socket.on('join_project', (projectId: string) => {
      socket.join(projectId);
      console.log(`User ${socket.id} joined project: ${projectId}`);
      socket.to(projectId).emit('notification', `New collaborator joined project ${projectId}`);
    });

    // Real-time Code Changes
    socket.on('send_code_change', (data: { projectId: string, code: string }) => {
      socket.to(data.projectId).emit('receive_code_change', {
        code: data.code,
        senderId: socket.id
      });
    });

    socket.on('disconnect', () => {
      console.log(`User Disconnected: ${socket.id}`);
    });
  });

  return io;
};