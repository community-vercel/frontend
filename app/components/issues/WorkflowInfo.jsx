    import { Sparkles } from 'lucide-react';

export default function WorkflowInfo() {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 mb-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-blue-900">Kanban Workflow</h3>
          <p className="text-blue-700 leading-relaxed">
            Drag issues between columns to organize your workflow. Short-term issues are ready for immediate action, while long-term issues require strategic planning.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
              <span className="text-sm font-medium text-amber-700">Short-term: Immediate action</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium text-blue-700">Long-term: Strategic planning</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
