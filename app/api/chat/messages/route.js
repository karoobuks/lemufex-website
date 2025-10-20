// //api/chat/messages
// import { NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/utils/authOptions';
// import connectedDB from '@/config/database';
// import Chat from '@/models/Chat';

// export async function GET(request) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const { searchParams } = new URL(request.url);
//     const chatId = searchParams.get('chatId');

//     if (!chatId) {
//       return NextResponse.json({ error: 'Chat ID required' }, { status: 400 });
//     }

//     await connectedDB();

//     // Use lean query for better performance
//     const chat = await Chat.findById(chatId).select('messages participants').lean();
//     if (!chat) {
//       return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
//     }

//     // Check if user is participant
//     const userId = session.user.id;
//     const isParticipant = chat.participants.some(p => p.userId.toString() === userId);
//     const isAdmin = session.user.role === 'admin';

//     if (!isParticipant && !isAdmin) {
//       return NextResponse.json({ error: 'Access denied' }, { status: 403 });
//     }

//     return NextResponse.json({ messages: chat.messages || [] });
//   } catch (error) {
//     console.error('Error fetching messages:', error);
//     return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
//   }
// }

// export async function POST(request) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const { chatId, message } = await request.json();

//     if (!chatId || !message?.trim()) {
//       return NextResponse.json({ error: 'Chat ID and message required' }, { status: 400 });
//     }

//     await connectedDB();

//     const chat = await Chat.findById(chatId).lean();
//     if (!chat) {
//       return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
//     }

//     // Check if user is participant
//     const userId = session.user.id;
//     const isParticipant = chat.participants.some(p => p.userId.toString() === userId);
//     const isAdmin = session.user.role === 'admin';

//     if (!isParticipant && !isAdmin) {
//       return NextResponse.json({ error: 'Access denied' }, { status: 403 });
//     }

//     // Create message object
//     const newMessage = {
//       senderId: userId,
//       senderName: session.user.firstName || 'User',
//       senderRole: session.user.role,
//       message: message.trim(),
//       timestamp: new Date()
//     };

//     // Use atomic update for better performance
//     const updatedChat = await Chat.findByIdAndUpdate(
//       chatId,
//       { $push: { messages: newMessage } },
//       { new: true, select: 'messages' }
//     );

//     const savedMessage = updatedChat.messages[updatedChat.messages.length - 1];
    
//     // Emit real-time message via Socket.IO immediately
//     if (global.io) {
//       const messageWithChatId = { ...savedMessage.toObject(), chatId };
      
//       // Emit to all participants in the chat room
//       global.io.to(chatId).emit('new-message', messageWithChatId);
      
//       // Only emit admin notification if message is from user
//       if (session.user.role !== 'admin') {
//         global.io.to('admin-room').emit('admin-notification', {
//           chatId,
//           message: savedMessage.toObject(),
//           userName: session.user.firstName || 'User'
//         });
//       }
//     }

//     return NextResponse.json({ success: true, message: savedMessage });
//   } catch (error) {
//     console.error('Error sending message:', error);
//     return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
//   }
// }

// /app/api/chat/messages/route.js
import { NextResponse } from 'next/server';
import { auth } from '@/app/api/auth/[...nextauth]/route';
import connectedDB from '@/config/database';
import Chat from '@/models/Chat';
import getRedis from '@/lib/redis';

export async function GET(request) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const chatId = searchParams.get('chatId');
    if (!chatId) return NextResponse.json({ error: 'Chat ID required' }, { status: 400 });

    await connectedDB();

    const chat = await Chat.findById(chatId).select('messages participants').lean();
    if (!chat) return NextResponse.json({ error: 'Chat not found' }, { status: 404 });

    const userId = session.user.id;
    const isParticipant = chat.participants.some(p => p.userId.toString() === userId);
    const isAdmin = session.user.role === 'admin';
    if (!isParticipant && !isAdmin) return NextResponse.json({ error: 'Access denied' }, { status: 403 });

    // Return messages (client handles pagination if needed)
    return NextResponse.json({ messages: chat.messages || [] });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { chatId, message } = await request.json();
    if (!chatId || !message?.trim()) return NextResponse.json({ error: 'Chat ID and message required' }, { status: 400 });

    await connectedDB();

    const chat = await Chat.findById(chatId);
    if (!chat) return NextResponse.json({ error: 'Chat not found' }, { status: 404 });

    const userId = session.user.id;
    const isParticipant = chat.participants.some(p => p.userId.toString() === userId);
    const isAdmin = session.user.role === 'admin';
    if (!isParticipant && !isAdmin) return NextResponse.json({ error: 'Access denied' }, { status: 403 });

    const newMessage = {
      senderId: userId,
      senderName: session.user.firstName || 'User',
      senderRole: session.user.role,
      message: message.trim(),
      timestamp: new Date()
    };

    chat.messages.push(newMessage);
    await chat.save();

    const savedMessage = chat.messages[chat.messages.length - 1];

    // Publish event to Redis for socket-server to broadcast
    try {
      const redis = getRedis();
      const payload = {
        type: 'new-message',
        chatId: chatId.toString(),
        message: {
          _id: savedMessage._id.toString(),
          senderId: savedMessage.senderId.toString(),
          senderName: savedMessage.senderName,
          senderRole: savedMessage.senderRole,
          message: savedMessage.message,
          timestamp: savedMessage.timestamp
        }
      };
      await redis.publish('chat:events', JSON.stringify(payload));
    } catch (pubErr) {
      console.warn('Redis publish failed:', pubErr.message || pubErr);
    }

    // Local dev convenience: if global.io exists emit immediately
    try {
      if (global.io) {
        const messageWithChatId = {
          _id: savedMessage._id.toString(),
          senderId: savedMessage.senderId.toString(),
          senderName: savedMessage.senderName,
          senderRole: savedMessage.senderRole,
          message: savedMessage.message,
          timestamp: savedMessage.timestamp,
          chatId: chatId.toString()
        };
        global.io.to(chatId.toString()).emit('new-message', messageWithChatId);
        if (session.user.role !== 'admin') {
          global.io.to('admin-room').emit('admin-notification', {
            chatId: chatId.toString(),
            message: messageWithChatId,
            userName: savedMessage.senderName
          });
        }
      }
    } catch (emitErr) {
      console.warn('In-process emit failed:', emitErr.message || emitErr);
    }

    return NextResponse.json({
      success: true,
      message: {
        _id: savedMessage._id.toString(),
        senderId: savedMessage.senderId.toString(),
        senderName: savedMessage.senderName,
        senderRole: savedMessage.senderRole,
        message: savedMessage.message,
        timestamp: savedMessage.timestamp
      }
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
