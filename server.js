import express from 'express';
import next from 'next';
import http from 'http';
import { Server } from 'socket.io';
import getRedis from './lib/redis.js';
import { createAdapter } from '@socket.io/redis-adapter';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

await app.prepare();

const server = express();
const httpServer = http.createServer(server);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

// Redis adapter for scaling Socket.IO
const redis = getRedis();
io.adapter(createAdapter(redis, redis.duplicate()));

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  socket.on('disconnect', () => console.log('User disconnected:', socket.id));
});

// ✅ FIX: change '*' to '(.*)' for Express 5 compatibility
server.use((req, res) => handle(req, res));


const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`> Server ready on http://localhost:${PORT}`);
});
