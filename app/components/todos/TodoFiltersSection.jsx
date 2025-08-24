import { useState } from 'react';
import { Filter, X, RefreshCw, Search, User } from 'lucide-react';
import Input from '../ui/Input';
import Select from '../ui/Select';

export default function TodoFiltersSection({ 
  filters, 
  onFilterChange, 
  onReset, 
  hasActiveFilters 
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
          <h3 className="font-semibold text-slate-800">Filter Tasks</h3>
          {hasActiveFilters && (
            <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-full">
              Active
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Reset
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
          <Input
            label="Search Tasks"
            value={filters.search}
            onChange={handleChange('search')}
            placeholder="Search in title or description..."
            className="bg-white border-slate-200 focus:border-emerald-400 focus:ring-emerald-400/20"
            icon={<Search className="w-4 h-4 text-slate-400" />}
          />
          
          <Input
            label="Assigned To"
            value={filters.assignedTo}
            onChange={handleChange('assignedTo')}
            placeholder="Search by assignee..."
            className="bg-white border-slate-200 focus:border-emerald-400 focus:ring-emerald-400/20"
            icon={<Search className="w-4 h-4 text-slate-400" />}
          />
          
          <Input
            label="Assigned By"
            value={filters.assignedBy}
            onChange={handleChange('assignedBy')}
            placeholder="Search by assigner..."
            className="bg-white border-slate-200 focus:border-emerald-400 focus:ring-emerald-400/20"
            icon={<User className="w-4 h-4 text-slate-400" />}
          />
          
          <Select 
            label="Status" 
            value={filters.status} 
            onChange={handleChange('status')}
            className="bg-white border-slate-200 focus:border-emerald-400 focus:ring-emerald-400/20"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="late">Late</option>
          </Select>
        </div>
      )}
    </div>
  );
}