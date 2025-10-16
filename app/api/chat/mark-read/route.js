import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/authOptions';
import connectedDB from '@/config/database';
import Chat from '@/models/Chat';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { chatId } = await request.json();
    if (!chatId) {
      return NextResponse.json({ error: 'Chat ID required' }, { status: 400 });
    }

    await connectedDB();

    const userId = session.user.id;
    
    // Mark all messages as read by this user
    await Chat.updateOne(
      { _id: chatId },
      {
        $addToSet: {
          'messages.$[].readBy': {
            userId: userId,
            readAt: new Date()
          }
        }
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    return NextResponse.json({ error: 'Failed to mark as read' }, { status: 500 });
  }
}