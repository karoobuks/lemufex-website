// import { NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/utils/authOptions';
// import connectedDB from '@/config/database';
// import Chat from '@/models/Chat';
// import User from '@/models/User';

// export async function GET(request) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     await connectedDB();

//     const userId = session.user.id;
//     const userRole = session.user.role;

//     let chats;
//     if (userRole === 'admin') {
//       // Admins see all chats with basic info only for faster loading
//       chats = await Chat.find({ status: 'active' })
//         .select('participants messages.senderId messages.message messages.timestamp')
//         .sort({ updatedAt: -1 })
//         .limit(50)
//         .lean();
//     } else {
//       // Regular users see only their chats
//       chats = await Chat.find({
//         'participants.userId': userId,
//         status: 'active'
//       })
//       .select('participants messages')
//       .sort({ updatedAt: -1 })
//       .lean();
//     }

//     return NextResponse.json({ chats });
//   } catch (error) {
//     console.error('Error fetching chats:', error);
//     return NextResponse.json({ error: 'Failed to fetch chats' }, { status: 500 });
//   }
// }

// export async function POST(request) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     await connectedDB();

//     const userId = session.user.id;
//     const userName = session.user.firstName || 'User';
//     const userRole = session.user.role;

//     // Check if chat already exists first (faster query)
//     let chat = await Chat.findOne({
//       'participants.userId': userId,
//       status: 'active'
//     }).lean();

//     if (!chat) {
//       // Find an available admin only if needed
//       const admin = await User.findOne({ role: 'admin' }).select('_id firstName').lean();
//       if (!admin) {
//         return NextResponse.json({ error: 'No admin available' }, { status: 404 });
//       }

//       // Create new chat
//       chat = await Chat.create({
//         participants: [
//           {
//             userId: userId,
//             name: userName,
//             role: userRole
//           },
//           {
//             userId: admin._id,
//             name: admin.firstName || 'Admin',
//             role: 'admin'
//           }
//         ],
//         messages: []
//       });
//     }

//     return NextResponse.json({ chatId: chat._id });
//   } catch (error) {
//     console.error('Error creating chat:', error);
//     return NextResponse.json({ error: 'Failed to create chat' }, { status: 500 });
//   }
// }





// /app/api/chat/route.js
import { NextResponse } from 'next/server';
import { auth } from '@/app/api/auth/[...nextauth]/route';
import connectedDB from '@/config/database';
import Chat from '@/models/Chat';
import User from '@/models/User';

// GET - list chats (admin or user)
export async function GET(request) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectedDB();

    const userId = session.user.id;
    const userRole = session.user.role;

    let chats;
    if (userRole === 'admin') {
      // Admins see recent active chats; limit for speed
      chats = await Chat.find({ status: 'active' })
        .select('participants messages')
        .sort({ updatedAt: -1 })
        .limit(50)
        .lean();
    } else {
      // Regular users see their chats
      chats = await Chat.find({
        'participants.userId': userId,
        status: 'active'
      })
      .select('participants messages')
      .sort({ updatedAt: -1 })
      .limit(50)
      .lean();
    }

    return NextResponse.json({ chats });
  } catch (error) {
    console.error('Error fetching chats:', error);
    return NextResponse.json({ error: 'Failed to fetch chats' }, { status: 500 });
  }
}

// POST - start or return existing chat for user
export async function POST(request) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectedDB();

    const userId = session.user.id;
    const userName = session.user.firstName || 'User';
    const userRole = session.user.role;

    // try to find existing active chat for this user
    let chat = await Chat.findOne({
      'participants.userId': userId,
      status: 'active'
    }).lean();

    if (!chat) {
      // pick an admin to assign (could be round-robin / least-busy later)
      const admin = await User.findOne({ role: 'admin' }).select('_id firstName').lean();
      if (!admin) {
        return NextResponse.json({ error: 'No admin available' }, { status: 404 });
      }

      const created = await Chat.create({
        participants: [
          { userId: userId, name: userName, role: userRole },
          { userId: admin._id, name: admin.firstName || 'Admin', role: 'admin' }
        ],
        messages: []
      });

      chat = created;
    }

    return NextResponse.json({ chatId: chat._id.toString() });
  } catch (error) {
    console.error('Error creating chat:', error);
    return NextResponse.json({ error: 'Failed to create chat' }, { status: 500 });
  }
}
