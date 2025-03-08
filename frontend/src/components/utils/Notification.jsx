import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

// Create a notification context to manage notifications across the app
import React, { createContext, useContext } from 'react';

// Create the notification context
export const NotificationContext = createContext();

// Types of notifications
const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
};

// Provider component that wraps the app and provides notification functionality
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Add a new notification
  const addNotification = (message, type = NOTIFICATION_TYPES.INFO, duration = 3000) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type, duration }]);
    return id;
  };

  // Remove a notification by ID
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  // Convenience methods for different notification types
  const showSuccess = (message, duration) => 
    addNotification(message, NOTIFICATION_TYPES.SUCCESS, duration);
  
  const showError = (message, duration) => 
    addNotification(message, NOTIFICATION_TYPES.ERROR, duration);
  
  const showInfo = (message, duration) => 
    addNotification(message, NOTIFICATION_TYPES.INFO, duration);

  return (
    <NotificationContext.Provider 
      value={{ 
        notifications, 
        addNotification, 
        removeNotification,
        showSuccess,
        showError,
        showInfo
      }}
    >
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
};

// Hook to use the notification context
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

// Container component that displays all active notifications
const NotificationContainer = () => {
  const { notifications, removeNotification } = useContext(NotificationContext);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {notifications.map(notification => (
          <Notification 
            key={notification.id}
            notification={notification}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

// Individual notification component
const Notification = ({ notification, onClose }) => {
  const { id, message, type, duration } = notification;

  // Auto-close after duration
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  // Get the appropriate icon and colors based on notification type
  const getNotificationStyles = () => {
    switch (type) {
      case NOTIFICATION_TYPES.SUCCESS:
        return {
          icon: <FiCheckCircle className="text-green-500" />,
          bgColor: 'bg-green-900/20',
          borderColor: 'border-green-500',
          textColor: 'text-green-400'
        };
      case NOTIFICATION_TYPES.ERROR:
        return {
          icon: <FiAlertCircle className="text-red-500" />,
          bgColor: 'bg-red-900/20',
          borderColor: 'border-red-500',
          textColor: 'text-red-400'
        };
      case NOTIFICATION_TYPES.INFO:
      default:
        return {
          icon: <FiInfo className="text-blue-500" />,
          bgColor: 'bg-blue-900/20',
          borderColor: 'border-blue-500',
          textColor: 'text-blue-400'
        };
    }
  };

  const { icon, bgColor, borderColor, textColor } = getNotificationStyles();

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={`${bgColor} ${borderColor} border rounded-lg shadow-lg p-4 min-w-[300px] max-w-md flex items-center gap-3`}
    >
      <div className="text-xl">{icon}</div>
      <p className={`${textColor} flex-grow text-sm`}>{message}</p>
      <button 
        onClick={onClose}
        className="text-zinc-400 hover:text-zinc-200 transition-colors"
      >
        <FiX />
      </button>
    </motion.div>
  );
}; 