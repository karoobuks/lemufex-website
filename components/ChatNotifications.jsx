// components/ChatNotifications.jsx
'use client';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

export const showTypingNotification = (userName, isAdmin = false) => {
  const message = `${userName} is typing...`;
  const style = isAdmin 
    ? { background: '#F59E0B', color: 'white' }
    : { background: '#10B981', color: 'white' };
    
  return toast.loading(message, {
    duration: 2000,
    style,
    icon: '⌨️'
  });
};

export const showMessageNotification = (message, isAdmin = false) => {
  const senderName = message.senderName || (isAdmin ? 'Admin' : 'Support');
  const preview = message.message.length > 50 
    ? message.message.substring(0, 50) + '...' 
    : message.message;
    
  const style = isAdmin 
    ? { background: '#F59E0B', color: 'white' }
    : { background: '#10B981', color: 'white' };
    
  return toast.success(`📨 ${senderName}: ${preview}`, {
    duration: 4000,
    style,
    position: 'bottom-right'
  });
};

export const showOnlineNotification = (userName, isOnline = true) => {
  const message = isOnline ? `${userName} is now online` : `${userName} went offline`;
  const style = isOnline 
    ? { background: '#10B981', color: 'white' }
    : { background: '#6B7280', color: 'white' };
    
  return toast(message, {
    duration: 2000,
    style,
    icon: isOnline ? '🟢' : '⚫'
  });
};

export const playNotificationSound = () => {
  try {
    const audio = new Audio('/notification.mp3');
    audio.volume = 0.5;
    audio.play().catch(() => {});
  } catch (e) {
    console.warn('Could not play notification sound');
  }
};

export const showBrowserNotification = (title, body, tag = 'chat') => {
  if ('Notification' in window && Notification.permission === 'granted') {
    return new Notification(title, {
      body,
      icon: '/favicon.ico',
      tag,
      requireInteraction: false,
      silent: false
    });
  }
  return null;
};

// Hook for managing notification permissions
export const useNotificationPermission = () => {
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          toast.success('🔔 Notifications enabled!', {
            duration: 3000,
            style: { background: '#10B981', color: 'white' }
          });
        }
      });
    }
  }, []);
};