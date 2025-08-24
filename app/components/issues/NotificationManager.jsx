// components/NotificationManager.js
import { forwardRef, useImperativeHandle, useCallback } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const NotificationManager = forwardRef((props, ref) => {
  const show = useCallback((message, type) => {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-xl text-white font-medium border ${
      type === 'success' 
        ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 border-emerald-400' 
        : 'bg-gradient-to-r from-red-500 to-red-600 border-red-400'
    } transition-all duration-300 transform translate-x-full`;
    
    const IconComponent = type === 'success' ? CheckCircle2 : AlertCircle;
    
    notification.innerHTML = `
      <div class="flex items-center gap-3">
        <div class="w-5 h-5">${type === 'success' ? '✓' : '!'}</div>
        <span>${message}</span>
      </div>
    `;
    
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);

    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }, []);

  useImperativeHandle(ref, () => ({
    show
  }));

  return null;
});

NotificationManager.displayName = 'NotificationManager';
export default NotificationManager;