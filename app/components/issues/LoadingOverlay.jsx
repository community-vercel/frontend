import { Loader2 } from 'lucide-react';

export default function LoadingOverlay({ show }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 flex items-center gap-4 border">
        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
        <div>
          <p className="font-semibold text-slate-900">Updating issue...</p>
          <p className="text-sm text-slate-600">Please wait</p>
        </div>
      </div>
    </div>
  );
}