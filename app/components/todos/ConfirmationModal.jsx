import { X, Loader2, AlertTriangle, CheckCircle } from 'lucide-react';

export default function ConfirmationModal({ 
  isOpen, 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  loading,
  type = 'warning' 
}) {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          icon: AlertTriangle,
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          confirmBg: 'bg-red-600 hover:bg-red-700',
          confirmText: 'Delete'
        };
      case 'info':
        return {
          icon: CheckCircle,
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600',
          confirmBg: 'bg-blue-600 hover:bg-blue-700',
          confirmText: 'Confirm'
        };
      default:
        return {
          icon: AlertTriangle,
          iconBg: 'bg-amber-100',
          iconColor: 'text-amber-600',
          confirmBg: 'bg-amber-600 hover:bg-amber-700',
          confirmText: 'Confirm'
        };
    }
  };

  const typeStyles = getTypeStyles();
  const Icon = typeStyles.icon;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl border max-w-md w-full transform animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${typeStyles.iconBg} rounded-xl flex items-center justify-center`}>
              <Icon className={`w-5 h-5 ${typeStyles.iconColor}`} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          </div>
          <button 
            onClick={onCancel}
            disabled={loading}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="p-6">
          <p className="text-slate-600 mb-6 leading-relaxed">{message}</p>
          
          <div className="flex gap-3 justify-end">
            <button
              onClick={onCancel}
              disabled={loading}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`px-6 py-2 ${typeStyles.confirmBg} text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2 font-medium`}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {typeStyles.confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
