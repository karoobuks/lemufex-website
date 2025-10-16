'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { FaComments, FaTimes, FaPaperPlane, FaUser, FaCheck, FaCheckDouble, FaExpand, FaCompress, FaMinus } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useLiveChat } from './GlobalLiveChat';

export default function LiveChat() {
  const [chatState, setChatState] = useState('collapsed');
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const lastScrollHeight = useRef(0);
  const { data: session } = useSession();
  const { 
    unreadCount, 
    setUnreadCount, 
    messages, 
    setMessages, 
    chatId, 
    setChatId, 
    adminUnreadCount,
    setAdminUnreadCount,
    socket 
  } = useLiveChat();
  
  const displayCount = session?.user?.role === 'admin' ? adminUnreadCount : unreadCount;

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

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Listen for typing events and clear unread count when chat is visible
  useEffect(() => {
    if (socket) {
      const handleTyping = (data) => {
        if (chatId && data.chatId === chatId && data.userId !== session?.user?.id) {
          setOtherUserTyping(data.isTyping);
        }
      };
      
      socket.on('user-typing', handleTyping);
      
      return () => {
        socket.off('user-typing', handleTyping);
      };
    }
  }, [socket, session?.user?.id, chatId]);
  
  // Clear unread count when chat becomes visible
  useEffect(() => {
    if (chatState !== 'collapsed' && session?.user?.role !== 'admin') {
      setUnreadCount(0);
      if (chatId) {
        markAsRead();
      }
    }
  }, [chatState, session?.user?.role, chatId]);

  const handleTyping = useCallback((value) => {
    setNewMessage(value);
    
    if (chatId && socket && session?.user) {
      if (!isTyping) {
        setIsTyping(true);
        socket.emit('typing', {
          chatId,
          userId: session.user.id,
          userName: session.user.firstName || 'User',
          isTyping: true
        });
      }
      
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        socket.emit('typing', {
          chatId,
          userId: session.user.id,
          userName: session.user.firstName || 'User',
          isTyping: false
        });
      }, 800);
    }
  }, [chatId, socket, session?.user, isTyping]);



  const markAsRead = useCallback(async () => {
    if (!chatId || chatState === 'collapsed') return;
    
    try {
      fetch('/api/chat/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId })
      }).catch(error => console.error('Failed to mark as read:', error));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  }, [chatId, chatState]);

  const startChat = useCallback(async () => {
    if (loading) return;
    
    try {
      setLoading(true);
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setChatId(data.chatId);
        await loadMessages(data.chatId);
      } else {
        toast.error(data.error || 'Failed to start chat');
      }
    } catch (error) {
      toast.error('Failed to start chat');
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const loadMessages = useCallback(async (id) => {
    try {
      const response = await fetch(`/api/chat/messages?chatId=${id}`);
      const data = await response.json();
      
      if (response.ok) {
        setMessages(data.messages || []);
        if (chatState !== 'collapsed') {
          setTimeout(() => markAsRead(), 100);
        }
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  }, [chatState, markAsRead]);

  const sendMessage = useCallback(async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatId || !session?.user) return;

    const messageText = newMessage.trim();
    const tempId = 'temp-' + Date.now();
    const tempMessage = {
      _id: tempId,
      senderId: session.user.id,
      senderName: session.user.firstName || 'User',
      senderRole: session.user.role,
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
        body: JSON.stringify({ chatId, message: messageText }),
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
  }, [newMessage, chatId, session?.user]);

  const handleOpen = useCallback(() => {
    // Clear unread count immediately
    if (session?.user?.role === 'admin') {
      setAdminUnreadCount(0);
      // Admin goes to chat page instead of opening LiveChat
      window.location.href = '/admin/chat';
      return;
    } else {
      setUnreadCount(0);
    }
    
    setChatState('normal');
    
    if (!chatId) {
      startChat();
    } else {
      loadMessages(chatId);
      setTimeout(() => markAsRead(), 100);
    }
  }, [session?.user?.role, chatId, startChat, loadMessages, markAsRead]);

  const getMessageStatus = (msg) => {
    if (msg.senderId !== session.user.id) return null;
    
    if (msg.status === 'sending') return 'sending';
    
    // Check if admin has received/read the message
    const adminRead = msg.readBy?.some(read => {
      // Find admin in participants or check if reader is admin
      return read.userId !== session.user.id;
    });
    
    return adminRead ? 'read' : 'delivered';
  };

  const getChatDimensions = () => {
    switch (chatState) {
      case 'maximized':
        return 'fixed inset-0 w-full h-full';
      case 'normal':
        return 'fixed bottom-6 right-6 w-80 h-96';
      case 'minimized':
        return 'fixed bottom-6 right-6 w-80 h-12';
      default:
        return 'hidden';
    }
  };

  if (!session) return null;

  return (
    <>
      {/* Chat Button */}
      {chatState === 'collapsed' && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={handleOpen}
            className="relative bg-[#FE9900] hover:bg-[#F8C400] text-white p-4 rounded-full shadow-lg transition-colors"
          >
            <FaComments className="text-xl" />
            {displayCount > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                {displayCount > 9 ? '9+' : displayCount}
              </div>
            )}
          </button>
        </div>
      )}

      {/* Chat Window */}
      {chatState !== 'collapsed' && (
        <div className={`${getChatDimensions()} bg-white ${chatState === 'maximized' ? 'rounded-none' : 'rounded-2xl'} shadow-2xl border border-gray-200 flex flex-col z-50`}>
          {/* Header */}
          <div className={`bg-gradient-to-r from-[#081C3C] to-[#0D274D] text-white p-4 ${chatState === 'maximized' ? 'rounded-none' : 'rounded-t-2xl'} flex items-center justify-between`}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#F8C400] rounded-full flex items-center justify-center">
                <FaUser className="text-[#081C3C] text-sm" />
              </div>
              <div>
                <h3 className="font-semibold">Lemufex Support</h3>
                <p className="text-xs text-gray-300">Online now</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setChatState(chatState === 'maximized' ? 'normal' : 'maximized')}
                className="text-gray-300 hover:text-white transition-colors p-1"
              >
                {chatState === 'maximized' ? <FaCompress /> : <FaExpand />}
              </button>
              <button
                onClick={() => setChatState('minimized')}
                className="text-gray-300 hover:text-white transition-colors p-1"
              >
                <FaMinus />
              </button>
              <button
                onClick={() => setChatState('collapsed')}
                className="text-gray-300 hover:text-white transition-colors p-1"
              >
                <FaTimes />
              </button>
            </div>
          </div>

          {/* Messages - Only show if not minimized */}
          {chatState !== 'minimized' && (
            <>
              <div ref={messagesContainerRef} className="flex-1 p-4 overflow-y-auto bg-[#F8F9FC] scroll-smooth">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-[#002B5B]">Starting chat...</div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-[#555] text-sm">
                    <p>Welcome to Lemufex Support!</p>
                    <p className="mt-2">How can we help you today?</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {messages.map((msg, index) => (
                      <div
                        key={msg._id || index}
                        className={`flex ${msg.senderId === session.user.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                            msg.senderId === session.user.id
                              ? 'bg-[#FE9900] text-white'
                              : 'bg-white text-[#444] border border-gray-200'
                          }`}
                        >
                          <p>{msg.message}</p>
                          <div className={`flex items-center justify-between mt-1 ${
                            msg.senderId === session.user.id ? 'text-orange-100' : 'text-[#A0AEC0]'
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
                                {(() => {
                                  const status = getMessageStatus(msg);
                                  if (status === 'sending') {
                                    return <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin opacity-50" />;
                                  } else if (status === 'read') {
                                    return <FaCheckDouble className="text-xs text-blue-300" />;
                                  } else {
                                    return <FaCheck className="text-xs" />;
                                  }
                                })()}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {otherUserTyping && (
                      <div className="flex justify-start">
                        <div className="bg-white text-[#444] border border-gray-200 px-3 py-2 rounded-lg text-sm">
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

              {/* Input */}
              <form onSubmit={sendMessage} className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => handleTyping(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE9900] focus:border-transparent text-sm text-gray-900 placeholder-gray-500"
                    disabled={!chatId}
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || !chatId}
                    className="bg-[#FE9900] hover:bg-[#F8C400] text-white p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaPaperPlane className="text-sm" />
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}