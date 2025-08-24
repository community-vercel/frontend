import { Plus, Target } from 'lucide-react';
import Button from '../ui/Button';

export default function PageHeader({ onCreateClick }) {
  return (
    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6 mb-8">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Target className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-blue-800 bg-clip-text text-transparent">
            Issues Board
          </h1>
        </div>
        <p className="text-slate-600">
          Organize and track your challenges with drag-and-drop simplicity
        </p>
      </div>
      
      <Button 
        onClick={onCreateClick}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg px-6 py-3 font-semibold flex items-center gap-2"
      >
        <Plus className="w-5 h-5" />
        Create Issue
      </Button>
    </div>
  );
}
