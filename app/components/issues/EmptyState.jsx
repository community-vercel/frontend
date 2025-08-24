import { FileQuestion, Plus, Target } from 'lucide-react';

export default function EmptyState({ 
  title = "No items found",
  description = "Get started by creating your first item",
  actionLabel = "Create New",
  onAction,
  icon: Icon = FileQuestion,
  hasFilters = false
}) {
  return (
    <div className="text-center py-12 px-6">
      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Icon className="w-8 h-8 text-slate-400" />
      </div>
      
      <h3 className="text-lg font-semibold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-500 mb-6 max-w-sm mx-auto">{description}</p>
      
      {hasFilters && (
        <p className="text-sm text-slate-400 mb-4">
          Try adjusting your filters or search criteria
        </p>
      )}
      
      {onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus className="w-4 h-4" />
          {actionLabel}
        </button>
      )}
    </div>
  );
}
