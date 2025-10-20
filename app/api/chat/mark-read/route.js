// // //api/chat/mark-read
// // import { NextResponse } from 'next/server';
// // import { getServerSession } from 'next-auth';
// // import { authOptions } from '@/utils/authOptions';
// // import connectedDB from '@/config/database';
// // import Chat from '@/models/Chat';

// // export async function POST(request) {
// //   try {
// //     const session = await getServerSession(authOptions);
// //     if (!session) {
// //       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
// //     }

// //     const { chatId } = await request.json();
// //     if (!chatId) {
// //       return NextResponse.json({ error: 'Chat ID required' }, { status: 400 });
// //     }

// //     await connectedDB();

// //     const userId = session.user.id;
    
// //     // Mark all messages as read by this user
// //     await Chat.updateOne(
// //       { _id: chatId },
// //       {
// //         $addToSet: {
// //           'messages.$[].readBy': {
// //             userId: userId,
// //             readAt: new Date()
// //           }
// //         }
// //       }
// //     );

// //     return NextResponse.json({ success: true });
// //   } catch (error) {
// //     console.error('Error marking messages as read:', error);
// //     return NextResponse.json({ error: 'Failed to mark as read' }, { status: 500 });
// //   }
// // }


// // file: /app/api/chat/mark-read/route.js
// import { NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/utils/authOptions';
// import connectedDB from '@/config/database';
// import Chat from '@/models/Chat';

// export async function POST(request) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

//     const { chatId } = await request.json();
//     if (!chatId) return NextResponse.json({ error: 'Chat ID required' }, { status: 400 });

//     await connectedDB();

//     const userId = session.user.id;

//     const chat = await Chat.findById(chatId);
//     if (!chat) return NextResponse.json({ error: 'Chat not found' }, { status: 404 });

//     // Ensure user is participant (or admin)
//     const isParticipant = chat.participants.some(p => p.userId.toString() === userId);
//     const isAdmin = session.user.role === 'admin';
//     if (!isParticipant && !isAdmin) return NextResponse.json({ error: 'Access denied' }, { status: 403 });

//     let changed = false;
//     const now = new Date();

//     for (const msg of chat.messages) {
//       // skip if already read by this user
//       const already = (msg.readBy || []).some(r => r.userId?.toString() === userId);
//       if (!already) {
//         msg.readBy = msg.readBy || [];
//         msg.readBy.push({ userId, readAt: now });
//         changed = true;
//       }
//     }

//     if (changed) {
//       await chat.save();
//     }

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error('Error marking messages as read:', error);
//     return NextResponse.json({ error: 'Failed to mark as read' }, { status: 500 });
//   }
// }


// /app/api/chat/mark-read/route.js
import { NextResponse } from 'next/server';
import { auth } from '@/app/api/auth/[...nextauth]/route';
import connectedDB from '@/config/database';
import Chat from '@/models/Chat';

export async function POST(request) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { chatId } = await request.json();
    if (!chatId) return NextResponse.json({ error: 'Chat ID required' }, { status: 400 });

    await connectedDB();

    const userId = session.user.id;
    const chat = await Chat.findById(chatId);
    if (!chat) return NextResponse.json({ error: 'Chat not found' }, { status: 404 });

    const isParticipant = chat.participants.some(p => p.userId.toString() === userId);
    const isAdmin = session.user.role === 'admin';
    if (!isParticipant && !isAdmin) return NextResponse.json({ error: 'Access denied' }, { status: 403 });

    const now = new Date();
    let changed = false;

    for (const msg of chat.messages) {
      const already = (msg.readBy || []).some(r => r.userId?.toString() === userId);
      if (!already) {
        msg.readBy = msg.readBy || [];
        msg.readBy.push({ userId, readAt: now });
        changed = true;
      }
    }

    if (changed) await chat.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    return NextResponse.json({ error: 'Failed to mark as read' }, { status: 500 });
  }
}
