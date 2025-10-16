'use client';
import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import LiveChat from './LiveChat';

const LiveChatContext = createContext();

export const useLiveChat = () => {
  const context = useContext(LiveChatContext);
  if (!context) {
    throw new Error('useLiveChat must be used within LiveChatProvider');
  }
  return context;
};

export function LiveChatProvider({ children }) {
  const [isVisible, setIsVisible] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [adminUnreadCount, setAdminUnreadCount] = useState(0);
  const socketRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const { data: session } = useSession();

  const showChat = useCallback(() => {
    setIsVisible(true);
    setUnreadCount(0);
  }, []);
  
  const hideChat = useCallback(() => setIsVisible(false), []);

  // Global Socket.IO connection with optimizations
  useEffect(() => {
    if (!session?.user) return;

    const initSocket = () => {
      if (socketRef.current?.connected) return;
      
      socketRef.current = io({
        transports: ['websocket', 'polling'],
        upgrade: true,
        rememberUpgrade: true,
        timeout: 5000,
        forceNew: false
      });
      
      socketRef.current.on('connect', () => {
        console.log('Socket connected:', socketRef.current.id);
        
        if (session.user.role === 'admin') {
          socketRef.current.emit('join-admin');
        }
        
        // Rejoin chat room if we have a chatId
        if (chatId) {
          socketRef.current.emit('join-chat', chatId);
        }
      });
      
      socketRef.current.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
        if (reason === 'io server disconnect') {
          // Reconnect manually if server disconnected
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = setTimeout(() => {
            socketRef.current?.connect();
          }, 1000);
        }
      });
      
      // Admin notifications
      if (session.user.role === 'admin') {
        socketRef.current.on('admin-notification', (data) => {
          setAdminUnreadCount(prev => prev + 1);
          
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
        });
      }
      
      // Real-time message updates
      socketRef.current.on('new-message', (message) => {
        if (message.senderId !== session.user.id) {
          setMessages(prev => {
            // Prevent duplicates
            const exists = prev.find(m => m._id === message._id);
            if (exists) return prev;
            return [...prev, message];
          });
          
          // User notifications (not admin)
          if (session.user.role !== 'admin' && !isVisible) {
            setUnreadCount(prev => prev + 1);
            
            try {
              const audio = new Audio('/notification.mp3');
              audio.volume = 0.5;
              audio.play().catch(() => {});
            } catch (e) {}
            
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('Lemufex Support', {
                body: message.message,
                icon: '/favicon.ico'
              });
            }
            
            toast.success('New message from support');
          }
        }
      });
    };
    
    initSocket();
    
    // Admin count clear event
    const handleClearAdminCount = () => {
      if (session.user.role === 'admin') {
        setAdminUnreadCount(0);
      }
    };
    
    window.addEventListener('clearAdminCount', handleClearAdminCount);
    
    return () => {
      window.removeEventListener('clearAdminCount', handleClearAdminCount);
      clearTimeout(reconnectTimeoutRef.current);
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [session?.user, isVisible, chatId]);

  // Join chat room when chatId changes
  useEffect(() => {
    if (chatId && socketRef.current?.connected) {
      console.log('Joining chat room:', chatId);
      socketRef.current.emit('join-chat', chatId);
    }
  }, [chatId]);

  return (
    <LiveChatContext.Provider value={{ 
      showChat, 
      hideChat, 
      isVisible, 
      unreadCount, 
      setUnreadCount,
      messages,
      setMessages,
      chatId,
      setChatId,
      adminUnreadCount,
      setAdminUnreadCount,
      socket: socketRef.current
    }}>
      {children}
      {session && <LiveChat />}
    </LiveChatContext.Provider>
  );
}