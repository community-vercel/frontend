import { useMemo } from 'react';
import { 
  ListTodo, 
  User, 
  Users, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';

export default function ViewTabs({ todos, currentView, onViewChange }) {
  const viewCounts = useMemo(() => ({
    all: todos.length,
    'my-todos': todos.filter(t => t.assignedTo === 'current_user').length,
    'assigned-by-me': todos.filter(t => t.assignedBy === 'current_user').length,
    completed: todos.filter(t => t.status === 'completed').length,
    incomplete: todos.filter(t => t.status === 'pending' || t.status === 'late').length,
  }), [todos]);

  const viewTabs = [
    { key: 'all', label: 'All Tasks', icon: ListTodo, color: 'slate' },
    { key: 'my-todos', label: 'My Tasks', icon: User, color: 'blue' },
    { key: 'assigned-by-me', label: 'Assigned by Me', icon: Users, color: 'purple' },
    { key: 'completed', label: 'Completed', icon: CheckCircle2, color: 'emerald' },
    { key: 'incomplete', label: 'Pending', icon: Clock, color: 'amber' },
  ];

  const getColorClasses = (color) => {
    const colors = {
      slate: { 
        bg: 'from-slate-50 to-slate-100', 
        border: 'border-slate-200', 
        text: 'text-slate-900', 
        icon: 'from-slate-500 to-slate-600',
        accent: 'text-slate-700',
        active: 'bg-slate-600'
      },
      blue: { 
        bg: 'from-blue-50 to-blue-100', 
        border: 'border-blue-200', 
        text: 'text-blue-900', 
        icon: 'from-blue-500 to-blue-600',
        accent: 'text-blue-700',
        active: 'bg-blue-600'
      },
      purple: { 
        bg: 'from-purple-50 to-purple-100', 
        border: 'border-purple-200', 
        text: 'text-purple-900', 
        icon: 'from-purple-500 to-purple-600',
        accent: 'text-purple-700',
        active: 'bg-purple-600'
      },
      emerald: { 
        bg: 'from-emerald-50 to-emerald-100', 
        border: 'border-emerald-200', 
        text: 'text-emerald-900', 
        icon: 'from-emerald-500 to-emerald-600',
        accent: 'text-emerald-700',
        active: 'bg-emerald-600'
      },
      amber: { 
        bg: 'from-amber-50 to-amber-100', 
        border: 'border-amber-200', 
        text: 'text-amber-900', 
        icon: 'from-amber-500 to-amber-600',
        accent: 'text-amber-700',
        active: 'bg-amber-600'
      }
    };
    return colors[color];
  };

  return (
    <>
      <div className="hidden md:grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {viewTabs.map((view) => {
          const Icon = view.icon;
          const colors = getColorClasses(view.color);
          const isActive = currentView === view.key;
          
          return (
            <div 
              key={view.key}
              className={`
                group cursor-pointer transition-all duration-300 rounded-2xl p-4 border-2
                ${isActive 
                  ? `bg-gradient-to-br ${colors.bg} ${colors.border} shadow-lg scale-105` 
                  : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:shadow-md hover:scale-102'
                }
              `}
              onClick={() => onViewChange(view.key)}
            >
              <div className="text-center space-y-3">
                <div className={`w-10 h-10 mx-auto rounded-xl flex items-center justify-center shadow-md ${
                  isActive 
                    ? `bg-gradient-to-r ${colors.icon}` 
                    : 'bg-slate-100 group-hover:bg-slate-200'
                } transition-all duration-300`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-600'}`} />
                </div>
                <div className="space-y-1">
                  <div className={`text-2xl font-bold ${isActive ? colors.text : 'text-slate-800'}`}>
                    {viewCounts[view.key]}
                  </div>
                  <div className={`text-xs font-medium leading-tight ${isActive ? colors.accent : 'text-slate-600'}`}>
                    {view.label}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-3 shadow-lg border mb-8">
        <div className="flex flex-wrap gap-2">
          {viewTabs.map((view) => {
            const Icon = view.icon;
            const colors = getColorClasses(view.color);
            const isActive = currentView === view.key;
            
            return (
              <button
                key={view.key}
                onClick={() => onViewChange(view.key)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200
                  ${isActive
                    ? `${colors.active} text-white shadow-lg transform scale-105`
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{view.label}</span>
                <span className={`
                  px-2 py-1 rounded-full text-xs font-bold
                  ${isActive 
                    ? 'bg-white/20 text-white' 
                    : 'bg-slate-200 text-slate-600'
                  }
                `}>
                  {viewCounts[view.key]}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  )}