const { Server } = require('socket.io');

let io;

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
      pingInterval: 25000
    });
    
    global.io = io;

    io.on('connection', (socket) => {
      console.log('User connected:', socket.id);

      socket.on('join-chat', (chatId) => {
        if (chatId) {
          socket.join(chatId);
          console.log(`User ${socket.id} joined chat ${chatId}`);
        }
      });

      socket.on('join-admin', () => {
        socket.join('admin-room');
        console.log(`Admin ${socket.id} joined admin room`);
      });

      socket.on('typing', (data) => {
        if (data?.chatId && data?.userId) {
          socket.to(data.chatId).emit('user-typing', {
            userId: data.userId,
            userName: data.userName,
            isTyping: data.isTyping,
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