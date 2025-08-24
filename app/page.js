'use client';
import { useState, useEffect } from 'react';
import {
  BarChart3,
  Target,
  CheckCircle,
  AlertTriangle,
  Plus,
  FileText,
  ListTodo,
  ArrowRight,
  Zap,
  Activity,
  RefreshCw
} from 'lucide-react';
import { fetchIssues, fetchTodos } from './lib/api';
import Link from 'next/link';
export default function HomePage() {
  const [stats, setStats] = useState({
    issues: { total: 0, short: 0, long: 0, open: 0, resolved: 0 },
    todos: { total: 0, pending: 0, completed: 0, late: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const issuesResponse = await fetchIssues({ limit: 10 });
      const todosResponse = await fetchTodos({ limit: 10 });
      const issues = issuesResponse.data || [];
      const todos = todosResponse.data || [];

      setStats({
        issues: {
          total: issues.length,
          short: issues.filter((i) => i.type === 'short').length,
          long: issues.filter((i) => i.type === 'long').length,
          open: issues.filter((i) => i.status === 'open').length,
          resolved: issues.filter((i) => i.status === 'resolved').length,
        },
        todos: {
          total: todos.length,
          pending: todos.filter((t) => t.status === 'pending').length,
          completed: todos.filter((t) => t.status === 'completed').length,
          late: todos.filter((t) => t.status === 'late').length,
        },
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-sm w-full">
          <div className="relative mx-auto w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-blue-100"></div>
            <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Activity className="w-6 h-6 text-blue-600 animate-pulse" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-slate-700">Loading Dashboard</h2>
            <p className="text-slate-500">Preparing your workspace...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-md w-full bg-white rounded-2xl p-8 shadow-lg border">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto" />
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-slate-800">Something went wrong</h2>
            <p className="text-slate-600">{error}</p>
          </div>
          <button
            onClick={fetchDashboardData}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Issues",
      value: stats.issues.total,
      icon: BarChart3,
      color: "blue",
      details: `${stats.issues.open} open • ${stats.issues.resolved} resolved`,
      trend: stats.issues.total > 0 ? `${Math.round((stats.issues.resolved / stats.issues.total) * 100)}% completion` : "No data"
    },
    {
      title: "Short-Term Issues",
      value: stats.issues.short,
      icon: Target,
      color: "amber",
      details: "Ready for action",
      trend: "Convert to tasks"
    },
    {
      title: "Completed Tasks",
      value: stats.todos.completed,
      icon: CheckCircle,
      color: "emerald",
      details: `${stats.todos.pending} pending`,
      trend: "Great progress!"
    },
    {
      title: "Urgent Items",
      value: stats.todos.late,
      icon: AlertTriangle,
      color: "red",
      details: stats.todos.late > 0 ? "Need attention" : "All caught up",
      trend: stats.todos.late > 0 ? "Action required" : "On track"
    }
  ];

  const quickActions = [
    {
      title: "Create Issue",
      description: "Document new challenges and opportunities",
      icon: Plus,
      href: "/issues?create=true",
      color: "blue"
    },
    {
      title: "Issues Board",
      description: "Visual kanban management system",
      icon: FileText,
      href: "/issues",
      color: "purple"
    },
    {
      title: "Task Manager",
      description: "Track and complete actionable items",
      icon: ListTodo,
      href: "/todos",
      color: "emerald"
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: 'from-blue-50 to-blue-100',
        border: 'border-blue-200',
        text: 'text-blue-900',
        icon: 'from-blue-500 to-blue-600',
        accent: 'text-blue-700'
      },
      amber: {
        bg: 'from-amber-50 to-amber-100',
        border: 'border-amber-200',
        text: 'text-amber-900',
        icon: 'from-amber-500 to-amber-600',
        accent: 'text-amber-700'
      },
      emerald: {
        bg: 'from-emerald-50 to-emerald-100',
        border: 'border-emerald-200',
        text: 'text-emerald-900',
        icon: 'from-emerald-500 to-emerald-600',
        accent: 'text-emerald-700'
      },
      red: {
        bg: 'from-red-50 to-red-100',
        border: 'border-red-200',
        text: 'text-red-900',
        icon: 'from-red-500 to-red-600',
        accent: 'text-red-700'
      },
      purple: {
        bg: 'from-purple-50 to-purple-100',
        border: 'border-purple-200',
        text: 'text-purple-900',
        icon: 'from-purple-500 to-purple-600',
        accent: 'text-purple-700'
      }
    };
    return colors[color];
  };

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-blue-800 bg-clip-text text-transparent">
              EOS Dashboard
            </h1>
          </div>

          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Transform challenges into opportunities with our integrated issue tracking and task management system
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statCards.map((card) => {
            const Icon = card.icon;
            const colors = getColorClasses(card.color);

            return (
              <div
                key={card.title}
                className={`group relative bg-gradient-to-br ${colors.bg} p-6 rounded-2xl border-2 ${colors.border} shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${colors.icon} rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className={`text-3xl font-bold ${colors.text} group-hover:scale-105 transition-transform`}>
                    {card.value}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className={`font-semibold ${colors.text}`}>
                    {card.title}
                  </h3>
                  <p className={`text-sm ${colors.accent} font-medium`}>
                    {card.details}
                  </p>
                  <p className={`text-xs ${colors.accent} opacity-75`}>
                    {card.trend}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border p-8 mb-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Quick Actions</h2>
              <p className="text-slate-600">Jump into your workflow</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action) => {
              const Icon = action.icon;
              const colors = getColorClasses(action.color);

              return (
                <Link
                  key={action.title}
                  href={action.href}
                  className={`group relative bg-gradient-to-br ${colors.bg} border-2 ${colors.border} rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${colors.icon} rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className={`font-bold text-lg ${colors.text}`}>
                          {action.title}
                        </h3>
                        <ArrowRight className={`w-5 h-5 ${colors.text} opacity-0 group-hover:opacity-100 transition-opacity`} />
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  )
}