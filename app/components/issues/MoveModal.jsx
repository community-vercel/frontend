import { X, Calendar } from 'lucide-react';
import Button from '../ui/Button';
export default function MoveToLongTermModal({ isOpen, onClose, onConfirm, isMoving, issueTitle }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-slate-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Move to Long-Term</h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-700 mb-3">
              Are you sure you want to move this issue to Long-Term?
            </p>
            <div className="bg-gray-50 rounded-lg p-3 border">
              <p className="text-sm font-medium text-gray-900 truncate">
                "{issueTitle}"
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button
              onClick={onClose}
              disabled={isMoving}
              className="flex-1 bg-gray-400 hover:bg-gray-200 text-gray-700 font-semibold transition-all duration-200"
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isMoving}
              className="flex-1 bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white font-semibold shadow-lg transition-all duration-200"
            >
              {isMoving ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Moving...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Move</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
