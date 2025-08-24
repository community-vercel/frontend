import { ListTodo, Plus, Filter } from 'lucide-react';

export default function EmptyTodoState({ hasFilters, currentView, onCreateClick }) {
  const getEmptyMessage = () => {
    if (hasFilters) {
      return {
        title: "No tasks match your filters",
        description: "Try adjusting your filter criteria or search terms",
        showCreate: false
      };
    }

    switch (currentView) {
      case 'my-todos':
        return {
          title: "No tasks assigned to you",
          description: "You're all caught up! No tasks are currently assigned to you.",
          showCreate: true
        };
      case 'assigned-by-me':
        return {
          title: "You haven't assigned any tasks",
          description: "Create tasks and assign them to team members to get started.",
          showCreate: true
        };
      case 'completed':
        return {
          title: "No completed tasks",
          description: "Complete some tasks to see them here.",
          showCreate: false
        };
      case 'incomplete':
        return {
          title: "No pending tasks",
          description: "Great! You have no pending tasks at the moment.",
          showCreate: true
        };
      default:
        return {
          title: "No tasks yet",
          description: "Create your first task to start managing your workflow.",
          showCreate: true
        };
    }
  };

  const { title, description, showCreate } = getEmptyMessage();

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border p-12">
      <div className="text-center space-y-6">
        <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto">
          {hasFilters ? (
            <Filter className="w-10 h-10 text-slate-400" />
          ) : (
            <ListTodo className="w-10 h-10 text-slate-400" />
          )}
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-slate-800">{title}</h3>
          <p className="text-slate-500 max-w-md mx-auto">{description}</p>
        </div>
        
        {showCreate && (
          <button
            onClick={onCreateClick}
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Create Your First Task
          </button>
        )}
        
        {hasFilters && (
          <p className="text-sm text-slate-400">
            Try clearing your filters or adjusting your search criteria
          </p>
        )}
      </div>
    </div>
  );
}
