'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { FaComments, FaPaperPlane, FaUser, FaCheck } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

export default function AdminChatPage() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [chatUnreadCounts, setChatUnreadCounts] = useState({});
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const { data: session } = useSession();

  const scrollToBottom = useCallback(() => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
      
      if (isNearBottom || container.scrollTop === 0) {
        setTimeout(() => {
          if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
          }
        }, 50);
      }
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (session?.user?.role === 'admin') {
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }
      
      loadChats();
      
      const initSocket = () => {
        if (socketRef.current?.connected) return;
        
        socketRef.current = io({
          transports: ['websocket', 'polling'],
          upgrade: true,
          timeout: 5000
        });
        
        socketRef.current.on('connect', () => {
          console.log('Admin socket connected');
          socketRef.current.emit('join-admin');
          
          // Rejoin selected chat if exists
          if (selectedChat) {
            socketRef.current.emit('join-chat', selectedChat._id);
          }
        });
        
        socketRef.current.on('admin-notification', (data) => {
          try {
            const audio = new Audio('/notification.mp3');
            audio.volume = 0.5;
            audio.play().catch(() => {});
          } catch (e) {}
          
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Lemufex Admin', {
              body: `New message from ${data.userName}`,
              icon: '/favicon.ico'
            });
          }
          
          toast.success(`New message from ${data.userName}`);
          
          setChatUnreadCounts(prev => ({
            ...prev,
            [data.chatId]: (prev[data.chatId] || 0) + 1
          }));
          
          // Refresh chat list
          loadChats();
        });
        
        socketRef.current.on('new-message', (message) => {
          if (selectedChat?._id === message.chatId && message.senderId !== session.user.id) {
            setMessages(prev => {
              const exists = prev.find(m => m._id === message._id);
              if (exists) return prev;
              return [...prev, message];
            });
          } else if (message.senderId !== session.user.id) {
            setChatUnreadCounts(prev => ({
              ...prev,
              [message.chatId]: (prev[message.chatId] || 0) + 1
            }));
          }
        });
        
        socketRef.current.on('user-typing', (data) => {
          if (selectedChat?._id === data.chatId && data.userId !== session.user.id) {
            setOtherUserTyping(data.isTyping);
          }
        });
      };
      
      initSocket();
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [session?.user?.role, selectedChat?._id]);

  const loadChats = useCallback(async () => {
    try {
      const response = await fetch('/api/chat');
      const data = await response.json();
      
      if (response.ok) {
        setChats(data.chats || []);
      }
    } catch (error) {
      console.error('Failed to load chats:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMessages = useCallback(async (chatId) => {
    try {
      const response = await fetch(`/api/chat/messages?chatId=${chatId}`);
      const data = await response.json();
      
      if (response.ok) {
        setMessages(data.messages || []);
        
        // Mark as read
        fetch('/api/chat/mark-read', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chatId }),
        }).catch(error => console.error('Failed to mark as read:', error));
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  }, []);

  const sendMessage = useCallback(async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat || !session?.user) return;

    const messageText = newMessage.trim();
    const tempId = 'temp-' + Date.now();
    const tempMessage = {
      _id: tempId,
      senderId: session.user.id,
      senderName: session.user.firstName || 'Admin',
      senderRole: 'admin',
      message: messageText,
      timestamp: new Date(),
      status: 'sending'
    };

    // Optimistically add message and clear input immediately
    setMessages(prev => [...prev, tempMessage]);
    setNewMessage('');

    try {
      const response = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId: selectedChat._id,
          message: messageText
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Replace temp message with real message
        setMessages(prev => 
          prev.map(msg => 
            msg._id === tempId 
              ? { ...data.message, status: 'sent' }
              : msg
          )
        );
      } else {
        // Remove temp message on error
        setMessages(prev => prev.filter(msg => msg._id !== tempId));
        toast.error(data.error || 'Failed to send message');
      }
    } catch (error) {
      setMessages(prev => prev.filter(msg => msg._id !== tempId));
      toast.error('Failed to send message');
    }
  }, [newMessage, selectedChat, session?.user]);

  const selectChat = useCallback((chat) => {
    setSelectedChat(chat);
    loadMessages(chat._id);
    setOtherUserTyping(false);
    
    // Clear unread count for this chat
    setChatUnreadCounts(prev => ({
      ...prev,
      [chat._id]: 0
    }));
    
    // Clear global admin unread count
    const totalUnread = Object.values(chatUnreadCounts).reduce((sum, count) => sum + count, 0) - (chatUnreadCounts[chat._id] || 0);
    if (totalUnread === 0) {
      window.dispatchEvent(new CustomEvent('clearAdminCount'));
    }
    
    if (socketRef.current?.connected) {
      console.log('Admin joining chat room:', chat._id);
      socketRef.current.emit('join-chat', chat._id);
    }
  }, [loadMessages, chatUnreadCounts]);
  
  const handleTyping = useCallback((value) => {
    setNewMessage(value);
    
    if (selectedChat && socketRef.current && session?.user) {
      if (!isTyping) {
        setIsTyping(true);
        socketRef.current.emit('typing', {
          chatId: selectedChat._id,
          userId: session.user.id,
          userName: session.user.firstName || 'Admin',
          isTyping: true
        });
      }
      
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        socketRef.current.emit('typing', {
          chatId: selectedChat._id,
          userId: session.user.id,
          userName: session.user.firstName || 'Admin',
          isTyping: false
        });
      }, 800);
    }
  }, [selectedChat, session?.user, isTyping]);

  const getLastMessage = (chat) => {
    if (!chat.messages || chat.messages.length === 0) return 'No messages yet';
    const lastMsg = chat.messages[chat.messages.length - 1];
    return lastMsg.message.length > 50 ? lastMsg.message.substring(0, 50) + '...' : lastMsg.message;
  };

  const getUnreadCount = (chat) => {
    return chatUnreadCounts[chat._id] || 0;
  };

  // Show loading while session is being fetched
  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#FE9900] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show access denied only after session is loaded and user is not admin
  if (session.user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="text-gray-600 mt-2">Admin access required</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F8F9FC]">
      <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-[#081C3C] flex items-center gap-2">
            <FaComments className="text-[#FE9900]" />
            Support Chats
          </h1>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Loading chats...</div>
          ) : chats.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No active chats</div>
          ) : (
            chats.map((chat) => {
              const user = chat.participants.find(p => p.role !== 'admin');
              const unreadCount = getUnreadCount(chat);
              
              return (
                <div
                  key={chat._id}
                  onClick={() => selectChat(chat)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                    selectedChat?._id === chat._id ? 'bg-[#FE9900]/10 border-l-4 border-l-[#FE9900]' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#081C3C] rounded-full flex items-center justify-center">
                        <FaUser className="text-white text-sm" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#081C3C]">{user?.name || 'User'}</h3>
                        <p className="text-sm text-gray-600">{getLastMessage(chat)}</p>
                      </div>
                    </div>
                    {unreadCount > 0 && (
                      <div className="bg-[#FE9900] text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            <div className="bg-white p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#081C3C] rounded-full flex items-center justify-center">
                  <FaUser className="text-white text-sm" />
                </div>
                <div>
                  <h2 className="font-semibold text-[#081C3C]">
                    {selectedChat.participants.find(p => p.role !== 'admin')?.name || 'User'}
                  </h2>
                  <p className="text-sm text-gray-600">Support Chat</p>
                </div>
              </div>
            </div>

            <div ref={messagesContainerRef} className="flex-1 p-4 overflow-y-auto scroll-smooth">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  <p>No messages yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg, index) => (
                    <div
                      key={msg._id || index}
                      className={`flex ${msg.senderId === session.user.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                          msg.senderId === session.user.id
                            ? 'bg-[#081C3C] text-white'
                            : 'bg-white text-[#444] border border-gray-200'
                        }`}
                      >
                        <p>{msg.message}</p>
                        <div className={`flex items-center justify-between mt-1 ${
                          msg.senderId === session.user.id ? 'text-gray-300' : 'text-gray-500'
                        }`}>
                          <p className="text-xs">
                            {msg.timestamp && !isNaN(new Date(msg.timestamp)) 
                              ? (() => {
                                  const msgDate = new Date(msg.timestamp);
                                  const today = new Date();
                                  const yesterday = new Date(today);
                                  yesterday.setDate(yesterday.getDate() - 1);
                                  
                                  if (msgDate.toDateString() === today.toDateString()) {
                                    return msgDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                  } else if (msgDate.toDateString() === yesterday.toDateString()) {
                                    return 'Yesterday ' + msgDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                  } else {
                                    return msgDate.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' + msgDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                  }
                                })()
                              : 'Now'
                            }
                          </p>
                          {msg.senderId === session.user.id && (
                            <div className="ml-2">
                              {msg.status === 'sending' ? (
                                <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin opacity-50" />
                              ) : (
                                <FaCheck className="text-xs" />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {otherUserTyping && (
                    <div className="flex justify-start">
                      <div className="bg-white text-[#444] border border-gray-200 px-4 py-2 rounded-lg">
                        <div className="flex items-center gap-1">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                          </div>
                          <span className="text-xs text-gray-500 ml-2">typing...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} className="h-1" />
                </div>
              )}
            </div>

            <form onSubmit={sendMessage} className="p-4 bg-white border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => handleTyping(e.target.value)}
                  placeholder="Type your response..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE9900] focus:border-transparent text-gray-900 placeholder-gray-500"
                  disabled={false}
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="bg-[#FE9900] hover:bg-[#F8C400] text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaPaperPlane />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <FaComments className="text-6xl text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Select a chat to start</h2>
              <p>Choose a conversation from the left to view messages</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}