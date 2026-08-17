import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { notifications, removeNotification } = useApp();

  if (notifications.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
    >
      {notifications.map((notif) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />,
          error: <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />,
          info: <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />,
        };

        const borderStyles = {
          success: 'border-l-4 border-l-emerald-500 bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl shadow-xl',
          warning: 'border-l-4 border-l-amber-500 bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl shadow-xl',
          error: 'border-l-4 border-l-rose-500 bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl shadow-xl',
          info: 'border-l-4 border-l-blue-500 bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl shadow-xl',
        };

        return (
          <div
            key={notif.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 ${borderStyles[notif.type]} transition-all transform duration-200`}
            role="alert"
          >
            {icons[notif.type]}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {notif.title}
              </h4>
              <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                {notif.message}
              </p>
            </div>
            <button
              onClick={() => removeNotification(notif.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              aria-label="Dismiss alert"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
