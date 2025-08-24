import { useMemo } from 'react';
import { 
  ListTodo, 
  User, 
  Users, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';

export default function ViewSummary({ currentView, todoCount, todos }) {
  const viewTabs = [
    { key: 'all', label: 'All Tasks', icon: ListTodo, color: 'slate' },
    { key: 'my-todos', label: 'My Tasks', icon: User, color: 'blue' },
    { key: 'assigned-by-me', label: 'Assigned by Me', icon: Users, color: 'purple' },
    { key: 'completed', label: 'Completed', icon: CheckCircle2, color: 'emerald' },
    { key: 'incomplete', label: 'Pending', icon: Clock, color: 'amber' },
  ];

  const viewCounts = useMemo(() => ({
    all: todos.length,
    'my-todos': todos.filter(t => t.assignedTo === 'current_user').length,
    'assigned-by-me': todos.filter(t => t.assignedBy === 'current_user').length,
    completed: todos.filter(t => t.status === 'completed').length,
    incomplete: todos.filter(t => t.status === 'pending' || t.status === 'late').length,
  }), [todos]);

  const getColorClasses = (color) => {
    const colors = {
      slate: { icon: 'from-slate-500 to-slate-600' },
      blue: { icon: 'from-blue-500 to-blue-600' },
      purple: { icon: 'from-purple-500 to-purple-600' },
      emerald: { icon: 'from-emerald-500 to-emerald-600' },
      amber: { icon: 'from-amber-500 to-amber-600' }
    };
    return colors[color];
  };

  const currentTab = viewTabs.find(v => v.key === currentView);
  if (!currentTab) return null;

  const Icon = currentTab.icon;
  const colors = getColorClasses(currentTab.color);

  const getViewDescription = () => {
    switch (currentView) {
      case 'my-todos':
        return ' assigned to you';
      case 'assigned-by-me':
        return ' assigned by you';
      case 'completed':
        return ' marked as completed';
      case 'incomplete':
        return ' requiring attention';
      default:
        return '';
    }
  };

  return (
    <div className="bg-gradient-to-r from-slate-50 to-emerald-50 border-2 border-slate-200 rounded-2xl p-6 mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 bg-gradient-to-r ${colors.icon} rounded-xl flex items-center justify-center shadow-md`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        <div className="text-4xl font-bold text-slate-300">
          {viewCounts[currentView]}
        </div>
      </div>
    </div>
        <div className="mt-2 text-slate-600">
            {currentTab.label} - {viewCounts[currentView]} task{viewCounts[currentView] !== 1 ? 's' : ''}{getViewDescription()}
        </div>
    </div>
  )
}