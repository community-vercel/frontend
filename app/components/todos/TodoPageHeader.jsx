import { Plus, ListTodo } from 'lucide-react';
import Button from '../ui/Button';

export default function TodoPageHeader({ onCreateClick }) {
  return (
    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6 mb-8">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
            <ListTodo className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-emerald-800 bg-clip-text text-transparent">
            Task Manager
          </h1>
        </div>
        <p className="text-slate-600">
          Track, assign, and complete your actionable tasks
        </p>
      </div>
      
      <Button 
        onClick={onCreateClick}
        className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 shadow-lg px-6 py-3 font-semibold flex items-center gap-2"
      >
        <Plus className="w-5 h-5" />
        Create Task
      </Button>
    </div>
  );
}