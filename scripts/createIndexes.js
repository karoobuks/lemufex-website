// Run this script to create critical database indexes
import mongoose from 'mongoose';
import connectedDB from '../config/database.js';

async function createIndexes() {
  await connectedDB();
  
  const db = mongoose.connection.db;
  
  // User indexes
  await db.collection('users').createIndex({ email: 1 }, { unique: true });
  await db.collection('users').createIndex({ role: 1 });
  await db.collection('users').createIndex({ isTrainee: 1 });
  await db.collection('users').createIndex({ createdAt: -1 });
  
  // Trainee indexes
  await db.collection('trainees').createIndex({ user: 1 }, { unique: true });
  await db.collection('trainees').createIndex({ email: 1 });
  await db.collection('trainees').createIndex({ 'trainings.track': 1 });
  await db.collection('trainees').createIndex({ createdAt: -1 });
  
  // Payment indexes
  await db.collection('payments').createIndex({ userId: 1, status: 1 });
  await db.collection('payments').createIndex({ reference: 1 }, { unique: true, sparse: true });
  await db.collection('payments').createIndex({ status: 1 });
  await db.collection('payments').createIndex({ createdAt: -1 });
  
  // Course indexes
  await db.collection('courses').createIndex({ name: 1 }, { unique: true });
  
  // Chat indexes
  await db.collection('chats').createIndex({ 'participants.userId': 1 });
  await db.collection('messages').createIndex({ chatId: 1, timestamp: -1 });
  
  console.log('✅ All indexes created successfully');
  process.exit(0);
}

createIndexes().catch(console.error);