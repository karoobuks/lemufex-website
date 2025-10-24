// //models/chat.js
// import mongoose from 'mongoose';

// const MessageSchema = new mongoose.Schema({
//   senderId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   senderName: {
//     type: String,
//     required: true
//   },
//   senderRole: {
//     type: String,
//     required: true
//   },
//   message: {
//     type: String,
//     required: true
//   },
//   timestamp: {
//     type: Date,
//     default: Date.now
//   },
//   readBy: [{
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User'
//     },
//     readAt: {
//       type: Date,
//       default: Date.now
//     }
//   }]
// });

// const ChatSchema = new mongoose.Schema({
//   participants: [{
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true
//     },
//     name: String,
//     role: String
//   }],
//   messages: [MessageSchema],
//   status: {
//     type: String,
//     enum: ['active', 'closed'],
//     default: 'active'
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// ChatSchema.index({ 'participants.userId': 1, updatedAt: -1 });

// ChatSchema.pre('save', function(next) {
//   this.updatedAt = Date.now();
//   next();
// });

// export default mongoose.models.Chat || mongoose.model('Chat', ChatSchema);



// /models/Chat.js
import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  senderName: {
    type: String,
    required: true
  },
  senderRole: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  readBy: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }]
}, { _id: true });

const ChatSchema = new mongoose.Schema({
  participants: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: String,
    role: String
  }],
  // NOTE: For very large scale consider moving messages to a separate Messages collection.
  messages: [MessageSchema],
  status: {
    type: String,
    enum: ['active', 'closed'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: false });

// keep updatedAt current
ChatSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Compound index for fast lookups by participant and recent updates
ChatSchema.index({ 'participants.userId': 1, updatedAt: -1 });

// export model safe for hot reloads (Next.js)
export default mongoose.models.Chat || mongoose.model('Chat', ChatSchema);
