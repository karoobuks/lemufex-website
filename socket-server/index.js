// const { createServer } = require('http');
// const { parse } = require('url');
// const next = require('next');
// const { initSocket } = require('./lib/socket.js');

// const dev = process.env.NODE_ENV !== 'production';
// const hostname = 'localhost';
// const port = parseInt(process.env.PORT) || 3000;

// const app = next({ dev, hostname, port });
// const handle = app.getRequestHandler();

// app.prepare().then(() => {
//   const server = createServer(async (req, res) => {
//     try {
//       const parsedUrl = parse(req.url, true);
//       await handle(req, res, parsedUrl);
//     } catch (err) {
//       console.error('Error occurred handling', req.url, err);
//       res.statusCode = 500;
//       res.end('internal server error');
//     }
//   });

//   const io = initSocket(server);
//   console.log('Socket.IO server initialized');

//   server
//     .once('error', (err) => {
//       if (err.code === 'EADDRINUSE') {
//         console.log(`Port ${port} is busy, trying ${port + 1}`);
//         server.listen(port + 1, () => {
//           console.log(`> Ready on http://${hostname}:${port + 1}`);
//           console.log('Socket.IO ready for connections');
//         });
//       } else {
//         console.error(err);
//         process.exit(1);
//       }
//     })
//     .listen(port, () => {
//       console.log(`> Ready on http://${hostname}:${port}`);
//       console.log('Socket.IO ready for connections');
//     });
// });


// socket-server/index.js
import http from 'http';
import express from 'express';
import { Server } from 'socket.io';
import createAdapter from '@socket.io/redis-adapter';
import Redis from 'ioredis';

const app = express();
const server = http.createServer(app);

const PORT = process.env.SOCKET_PORT || 4000;
const REDIS_URL = process.env.REDIS_URL;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || '*';

if (!REDIS_URL) {
  console.error('REDIS_URL missing - socket server requires Redis');
  process.exit(1);
}

// Create Redis pub/sub clients
const pubClient = new Redis(REDIS_URL, { maxRetriesPerRequest: null });
const subClient = pubClient.duplicate();

const io = new Server(server, {
  cors: {
    origin: CLIENT_ORIGIN,
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling'],
  pingInterval: 25000,
  pingTimeout: 60000,
  maxHttpBufferSize: 1e6
});

// set adapter
(async () => {
  try {
    // ioredis exposes the `duplicate` connection; @socket.io/redis-adapter works with redis clients that expose `sendCommand`.
    const publisher = pubClient;
    const subscriber = subClient;
    await subscriber.connect();
    await publisher.connect();
    io.adapter(createAdapter(publisher, subscriber));
    console.log('✅ Socket.IO Redis adapter connected');
  } catch (err) {
    console.error('Failed to set up Redis adapter:', err);
    process.exit(1);
  }
})();

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  // Store user info on socket for status tracking
  socket.on('user-connect', (userData) => {
    socket.userId = userData.userId;
    socket.userRole = userData.role;
    socket.userName = userData.name;
    
    // Notify others about user coming online
    if (userData.role === 'admin') {
      socket.broadcast.emit('admin-online', { userId: userData.userId, role: 'admin' });
    } else {
      io.to('admin-room').emit('user-online', { userId: userData.userId, userName: userData.name });
    }
  });

  socket.on('join-chat', (chatId) => {
    if (!chatId) return;
    socket.join(chatId.toString());
    console.log(`Socket ${socket.id} joined chat ${chatId}`);
  });

  socket.on('join-admin', () => {
    socket.join('admin-room');
    console.log(`Socket ${socket.id} joined admin-room`);
  });

  socket.on('typing', (payload) => {
    if (!payload?.chatId) return;
    socket.to(payload.chatId.toString()).emit('user-typing', {
      ...payload,
      userName: payload.userName || socket.userName || 'User'
    });
  });

  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', socket.id, reason);
    
    // Notify others about user going offline
    if (socket.userRole === 'admin') {
      socket.broadcast.emit('admin-offline', { userId: socket.userId, role: 'admin' });
    } else if (socket.userId) {
      io.to('admin-room').emit('user-offline', { userId: socket.userId, userName: socket.userName });
    }
  });

  socket.on('error', (err) => {
    console.error('Socket error from', socket.id, err);
  });
});

// subscribe to Redis pubsub channel to broadcast messages
(async function startSubscriber() {
  const sub = new Redis(REDIS_URL, { maxRetriesPerRequest: null });
  sub.on('error', (e) => console.error('Subscriber redis error', e));
  await sub.connect();
  await sub.subscribe('chat:events', (message) => {
    try {
      const payload = JSON.parse(message);
      if (!payload || !payload.type) return;

      if (payload.type === 'new-message') {
        const { chatId, message: msg } = payload;
        io.to(chatId.toString()).emit('new-message', { ...msg, chatId });
        if ((msg.senderRole || '').toLowerCase() !== 'admin') {
          io.to('admin-room').emit('admin-notification', {
            chatId,
            message: { ...msg, chatId },
            userName: msg.senderName || 'User',
            timestamp: new Date()
          });
        }
      }
      // add more event types (typing, system) if you publish them
    } catch (err) {
      console.error('Failed to parse redis message', err);
    }
  });
  console.log('✅ Redis subscriber listening on chat:events');
})();

server.listen(PORT, () => {
  console.log(`Socket server listening on port ${PORT}`);
});
