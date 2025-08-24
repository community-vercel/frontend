import { forwardRef, useImperativeHandle, useEffect, useCallback } from 'react';

const NotificationManager = forwardRef((props, ref) => {
  useEffect(() => {
    let root = document.getElementById('toast-root');
    if (!root) {
      root = document.createElement('div');
      root.id = 'toast-root';
      root.className =
        'fixed top-4 right-4 z-50 flex flex-col gap-3 pointer-events-none';
      document.body.appendChild(root);
    }
  }, []);

  const show = useCallback((message, type = 'info', opts = {}) => {
    const { duration = 5000 } = opts;

    const styles = {
      success: {
        icon: '✓',
        bg: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
        border: 'border-emerald-400',
      },
      error: {
        icon: '!',
        bg: 'bg-gradient-to-r from-red-500 to-red-600',
        border: 'border-red-400',
      },
      warning: {
        icon: '⚠',
        bg: 'bg-gradient-to-r from-amber-500 to-amber-600',
        border: 'border-amber-400',
      },
      info: {
        icon: 'i',
        bg: 'bg-gradient-to-r from-blue-500 to-blue-600',
        border: 'border-blue-400',
      },
    };

    const { icon, bg, border } = styles[type] || styles.info;
    const root = document.getElementById('toast-root');

    const toast = document.createElement('div');
    toast.className = [
      'pointer-events-auto px-6 py-4 rounded-xl shadow-xl text-white font-medium border',
      bg,
      border,
      'transition-transform transition-opacity duration-300 will-change-transform max-w-sm',
    ].join(' ');

    const row = document.createElement('div');
    row.className = 'flex items-center gap-3';
    const iconEl = document.createElement('div');
    iconEl.className = 'w-5 h-5 flex items-center justify-center';
    iconEl.textContent = icon;
    const msgEl = document.createElement('span');
    msgEl.className = 'flex-1';
    msgEl.textContent = message;
    const closeBtn = document.createElement('button');
    closeBtn.className =
      'w-6 h-6 flex items-center justify-center hover:bg-white/20 rounded';
    closeBtn.textContent = '×';

    row.append(iconEl, msgEl, closeBtn);
    toast.appendChild(row);

    toast.style.transform = 'translateX(110%)';
    toast.style.opacity = '0';

    root.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.transform = 'translateX(0)';
      toast.style.opacity = '1';
    });

    const close = () => {
      toast.style.transform = 'translateX(110%)';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    };

    closeBtn.addEventListener('click', close);

    let timer = setTimeout(close, duration);
    toast.addEventListener('mouseenter', () => {
      clearTimeout(timer);
      timer = null;
    });
    toast.addEventListener('mouseleave', () => {
      if (!timer) timer = setTimeout(close, 1500);
    });

    return close; 
  }, []);

  useImperativeHandle(ref, () => ({ show }));

  return null;
});

NotificationManager.displayName = 'NotificationManager';
export default NotificationManager;
