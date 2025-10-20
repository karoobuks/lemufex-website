//lib/socket.js
const { Server } = require('socket.io');

let io;
let redisAdapter;

// Lazy load Redis dependencies
let createAdapter, createClient;
try {
  createAdapter = require('@socket.io/redis-adapter').createAdapter;
  createClient = require('redis').createClient;
} catch (error) {
  console.log('📦 Redis packages not installed - using memory adapter');
}

function initSocket(server) {
  if (!io) {
    io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      },
      transports: ['websocket', 'polling'],
      allowEIO3: true,
      pingTimeout: 60000,
      pingInterval: 25000,
      maxHttpBufferSize: 1e6,
      connectionStateRecovery: {
        maxDisconnectionDuration: 2 * 60 * 1000,
        skipMiddlewares: true,
      }
    });
    
    // Redis adapter for clustering (only in production)
    if (process.env.NODE_ENV === 'production' && process.env.REDIS_URL) {
      setupRedisAdapter();
    } else {
      console.log('🔧 Using memory adapter for development');
    }
    
    global.io = io;

    // Redis setup function
    async function setupRedisAdapter() {
      if (!createAdapter || !createClient) {
        console.warn('⚠️ Redis packages not available');
        return;
      }
      
      try {
        const pubClient = createClient({ 
          url: process.env.REDIS_URL,
          socket: {
            connectTimeout: 5000,
            lazyConnect: true
          }
        });
        const subClient = pubClient.duplicate();
        
        await Promise.all([
          pubClient.connect(),
          subClient.connect()
        ]);
        
        redisAdapter = createAdapter(pubClient, subClient);
        io.adapter(redisAdapter);
        console.log('✅ Socket.IO Redis adapter connected');
      } catch (error) {
        console.warn('⚠️ Redis adapter failed, using memory adapter:', error.message);
      }
    }

    io.on('connection', (socket) => {
      console.log('User connected:', socket.id);

      socket.on('join-chat', (chatId) => {
        if (chatId && typeof chatId === 'string' && chatId.length < 50) {
          socket.join(chatId);
          console.log(`User ${socket.id} joined chat ${chatId}`);
        }
      });

      socket.on('join-admin', () => {
        socket.join('admin-room');
        console.log(`Admin ${socket.id} joined admin room`);
      });

      socket.on('typing', (data) => {
        if (data?.chatId && data?.userId && typeof data.chatId === 'string') {
          socket.to(data.chatId).emit('user-typing', {
            userId: data.userId,
            userName: data.userName || 'User',
            isTyping: !!data.isTyping,
            chatId: data.chatId
          });
        }
      });

      socket.on('disconnect', (reason) => {
        console.log('User disconnected:', socket.id, 'Reason:', reason);
      });

      socket.on('error', (error) => {
        console.error('Socket error:', error);
      });
    });
  }
  return io;
}

function getSocket() {
  return io;
}

function getConnectedClients() {
  return io ? io.engine.clientsCount : 0;
}

module.exports = { initSocket, getSocket };