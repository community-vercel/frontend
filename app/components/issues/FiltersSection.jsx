import { Filter } from 'lucide-react';
import Select from '../ui/Select';

export default function FiltersSection({ filters, onFilterChange, disabled }) {
  const handleChange = (field) => (e) => {
    onFilterChange(field, e.target.value);
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border p-6 mb-8">
      <div className="flex items-center gap-3 mb-4">
        <Filter className="w-5 h-5 text-slate-600" />
        <h3 className="font-semibold text-slate-800">Filters</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
    </div>
  );
}
