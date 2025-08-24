import { BarChart3, Target, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

export default function IssueStats({ issues }) {
  const stats = {
    total: issues.length,
    shortTerm: issues.filter(i => i.type === 'short').length,
    longTerm: issues.filter(i => i.type === 'long').length,
    open: issues.filter(i => i.status === 'open').length,
    resolved: issues.filter(i => i.status === 'resolved').length,
    high: issues.filter(i => i.priority === 'high' || i.priority === 'critical').length,
  };

  const statItems = [
    { label: 'Total', value: stats.total, icon: BarChart3, color: 'blue' },
    { label: 'Short-term', value: stats.shortTerm, icon: Target, color: 'amber' },
    { label: 'Long-term', value: stats.longTerm, icon: Clock, color: 'indigo' },
    { label: 'Open', value: stats.open, icon: AlertTriangle, color: 'red' },
    { label: 'Resolved', value: stats.resolved, icon: CheckCircle, color: 'emerald' },
    { label: 'High Priority', value: stats.high, icon: AlertTriangle, color: 'orange' },
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-700 border-blue-200',
      amber: 'bg-amber-50 text-amber-700 border-amber-200',
      indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      red: 'bg-red-50 text-red-700 border-red-200',
      emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      orange: 'bg-orange-50 text-orange-700 border-orange-200',
    };
    return colors[color] || colors.blue;
  };

  if (stats.total === 0) return null;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border p-6 mb-8">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Issue Statistics</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statItems.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className={`p-4 rounded-xl border ${getColorClasses(color)}`}>
            <div className="flex items-center gap-2 mb-2">
              <Icon className="w-4 h-4" />
              <span className="text-xs font-medium opacity-75">{label}</span>
            </div>
            <div className="text-2xl font-bold">{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

