import { Plus, Download, Upload, Settings } from 'lucide-react';

export default function ActionBar({ 
  onCreateIssue,
  onExport,
  onImport,
  onSettings,
  issueCount = 0 
}) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onCreateIssue}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            Create Issue
          </button>
          
          {issueCount > 0 && (
            <>
              <button
                onClick={onExport}
                className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
              
              <button
                onClick={onImport}
                className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <Upload className="w-4 h-4" />
                Import
              </button>
            </>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {issueCount > 0 && (
            <span className="text-sm text-slate-500">
              {issueCount} issue{issueCount !== 1 ? 's' : ''}
            </span>
          )}
          
          <button
            onClick={onSettings}
            className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )}