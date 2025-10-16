import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/authOptions';
import connectedDB from '@/config/database';
import Chat from '@/models/Chat';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const chatId = searchParams.get('chatId');

    if (!chatId) {
      return NextResponse.json({ error: 'Chat ID required' }, { status: 400 });
    }

    await connectedDB();

    // Use lean query for better performance
    const chat = await Chat.findById(chatId).select('messages participants').lean();
    if (!chat) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }

    // Check if user is participant
    const userId = session.user.id;
    const isParticipant = chat.participants.some(p => p.userId.toString() === userId);
    const isAdmin = session.user.role === 'admin';

    if (!isParticipant && !isAdmin) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    return NextResponse.json({ messages: chat.messages || [] });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { chatId, message } = await request.json();

    if (!chatId || !message?.trim()) {
      return NextResponse.json({ error: 'Chat ID and message required' }, { status: 400 });
    }

    await connectedDB();

    const chat = await Chat.findById(chatId).lean();
    if (!chat) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }

    // Check if user is participant
    const userId = session.user.id;
    const isParticipant = chat.participants.some(p => p.userId.toString() === userId);
    const isAdmin = session.user.role === 'admin';

    if (!isParticipant && !isAdmin) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Create message object
    const newMessage = {
      senderId: userId,
      senderName: session.user.firstName || 'User',
      senderRole: session.user.role,
      message: message.trim(),
      timestamp: new Date()
    };

    // Use atomic update for better performance
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { $push: { messages: newMessage } },
      { new: true, select: 'messages' }
    );

    const savedMessage = updatedChat.messages[updatedChat.messages.length - 1];
    
    // Emit real-time message via Socket.IO immediately
    if (global.io) {
      const messageWithChatId = { ...savedMessage.toObject(), chatId };
      
      // Emit to all participants in the chat room
      global.io.to(chatId).emit('new-message', messageWithChatId);
      
      // Only emit admin notification if message is from user
      if (session.user.role !== 'admin') {
        global.io.to('admin-room').emit('admin-notification', {
          chatId,
          message: savedMessage.toObject(),
          userName: session.user.firstName || 'User'
        });
      }
    }

    return NextResponse.json({ success: true, message: savedMessage });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}