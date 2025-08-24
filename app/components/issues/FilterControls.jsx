import { useState } from 'react';
import { Filter, X, RefreshCw } from 'lucide-react';
import Select from '../ui/Select';

export default function FilterControls({ 
  filters, 
  onFilterChange, 
  onReset, 
  hasActiveFilters,
  disabled = false 
}) {
  const [isExpanded, setIsExpanded] = useState(hasActiveFilters);

  const handleChange = (field) => (e) => {
    onFilterChange(field, e.target.value);
  };

  const handleReset = () => {
    onReset();
    setIsExpanded(false);
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-slate-600" />
          <h3 className="font-semibold text-slate-800">Filters</h3>
          {hasActiveFilters && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
              Active
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={handleReset}
              disabled={disabled}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className="w-4 h-4" />
              Reset
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            disabled={disabled}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
          >
            {isExpanded ? (
              <>
                <X className="w-4 h-4" />
                Collapse
              </>
            ) : (
              <>
                <Filter className="w-4 h-4" />
                Expand
              </>
            )}
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
          <Select 
            label="Type" 
            value={filters.type} 
            onChange={handleChange('type')}
            disabled={disabled}
            className="bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 disabled:opacity-50"
          >
            <option value="">All Types</option>
            <option value="short">Short-term</option>
            <option value="long">Long-term</option>
          </Select>
          
          <Select 
            label="Status" 
            value={filters.status} 
            onChange={handleChange('status')}
            disabled={disabled}
            className="bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 disabled:opacity-50"
          >
            <option value="">All Statuses</option>
            <option value="open">Open</option>
            <option value="resolved">Resolved</option>
          </Select>
          
          <Select 
            label="Priority" 
            value={filters.priority} 
            onChange={handleChange('priority')}
            disabled={disabled}
            className="bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 disabled:opacity-50"
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </Select>
        </div>
      )}
    </div>
  );
}
