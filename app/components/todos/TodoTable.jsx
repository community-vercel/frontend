'use client';
import { useState } from 'react';
import { createPortal } from 'react-dom'; 
import {
    CheckCircle2,
    Circle,
    Clock,
    Edit,
    Trash2,
    Calendar,
    User,
    ChevronUp,
    ChevronDown,
    AlertTriangle,
    Target,
    MoreVertical,
    Eye,
    X
} from 'lucide-react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import TodoFormModal from './TodoFormModal';

export default function TodoTable({ todos, onEdit, onDelete, onComplete, onUpdate }) {
    console.log(todos);
    const [sortField, setSortField] = useState('dueDate');
    const [sortDirection, setSortDirection] = useState('asc');
    const [expandedRows, setExpandedRows] = useState(new Set());
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingTodo, setEditingTodo] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const toggleRowExpansion = (todoId) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(todoId)) {
            newExpanded.delete(todoId);
        } else {
            newExpanded.add(todoId);
        }
        setExpandedRows(newExpanded);
    };

    const handleEditClick = (todo) => {
        setEditingTodo(todo);
        setShowEditModal(true);
    };

    const handleEditSubmit = async (formData) => {
        try {
            setIsUpdating(true);
            await onEdit(editingTodo._id, formData);
            setShowEditModal(false);
            setEditingTodo(null);
        } catch (error) {
            console.error('Error updating todo:', error);
            throw error;
        } finally {
            setIsUpdating(false);
        }
    };

    const sortedTodos = [...todos].sort((a, b) => {
        let aValue = a[sortField];
        let bValue = b[sortField];

        if (sortField === 'dueDate') {
            aValue = new Date(aValue);
            bValue = new Date(bValue);
        }

        if (sortDirection === 'asc') {
            return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
            return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
    });

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
                return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
            case 'late':
                return <AlertTriangle className="w-4 h-4 text-red-500" />;
            default:
                return <Circle className="w-4 h-4 text-slate-400" />;
        }
    };

    const getStatusBadge = (todo) => {
        const dueDate = new Date(todo.dueDate);
        const today = new Date();
        const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

        if (todo.status === 'completed') {
            return { variant: 'success', text: 'Completed', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
        }
        if (todo.status === 'late') {
            return { variant: 'danger', text: 'Overdue', color: 'text-red-600 bg-red-50 border-red-200' };
        }
        if (diffDays <= 1 && diffDays >= 0) {
            return { variant: 'warning', text: 'Due Soon', color: 'text-amber-600 bg-amber-50 border-amber-200' };
        }
        return { variant: 'primary', text: 'Pending', color: 'text-blue-600 bg-blue-50 border-blue-200' };
    };

    const formatDate = (date) => {
        const dateObj = new Date(date);
        const today = new Date();
        const diffDays = Math.ceil((dateObj - today) / (1000 * 60 * 60 * 24));

        const formatted = dateObj.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: dateObj.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
        });

        if (diffDays === 0) return `${formatted} (Today)`;
        if (diffDays === 1) return `${formatted} (Tomorrow)`;
        if (diffDays === -1) return `${formatted} (Yesterday)`;
        if (diffDays < -1) return `${formatted} (${Math.abs(diffDays)} days ago)`;
        if (diffDays > 1) return `${formatted} (${diffDays} days)`;

        return formatted;
    };

    const formatDateShort = (date) => {
        const dateObj = new Date(date);
        const today = new Date();
        const diffDays = Math.ceil((dateObj - today) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Tomorrow';
        if (diffDays === -1) return 'Yesterday';
        if (diffDays < -1) return `${Math.abs(diffDays)}d ago`;
        if (diffDays > 1) return `${diffDays}d`;

        return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const SortableHeader = ({ field, children, className = "" }) => (
        <th
            className={`px-3 sm:px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-50 transition-colors border-b border-slate-200 ${className}`}
            onClick={() => handleSort(field)}
        >
            <div className="flex items-center gap-2">
                <span className="hidden sm:inline">{children}</span>
                <span className="sm:hidden text-xs">{typeof children === 'string' ? children.split(' ')[0] : children}</span>
                {sortField === field ? (
                    sortDirection === 'asc' ? (
                        <ChevronUp className="w-4 h-4 text-blue-500" />
                    ) : (
                        <ChevronDown className="w-4 h-4 text-blue-500" />
                    )
                ) : (
                    <div className="w-4 h-4 opacity-30">
                        <ChevronUp className="w-4 h-4" />
                    </div>
                )}
            </div>
        </th>
    );

    if (todos.length === 0) {
        return (
            <div className="text-center py-16 px-4">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mb-6">
                    <Target className="w-12 h-12 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-600 mb-2">No tasks found</h3>
                <p className="text-slate-500 mb-6">Create a new todo or convert an issue to get started.</p>
            </div>
        );
    }

    const renderActionButtons = (todo, isMobile = false) => {
        const iconSizes = isMobile ? "w-4 h-4" : "w-5 h-5";

        return (
            <div
                className={`flex gap-2 ${isMobile ? "w-full flex-wrap justify-between" : ""}`}
            >
                {todo.status === "pending" && (
                    <Button
                        variant="success"
                        size={isMobile ? "sm" : "md"}
                        onClick={() => onComplete(todo._id, todo.title)}
                        title={isMobile ? undefined : "Mark as Complete"}
                        className="flex items-center gap-1"
                    >
                        <CheckCircle2 className={iconSizes} />
                        {isMobile && <span>Complete</span>}
                    </Button>
                )}

                <Button
                    variant="primary"
                    size={isMobile ? "sm" : "md"}
                    onClick={() => handleEditClick(todo)}
                    title={isMobile ? undefined : "Edit Task"}
                    className="flex items-center gap-1"
                >
                    <Edit className={iconSizes} />
                    {isMobile && <span>Edit</span>}
                </Button>

                <Button
                    variant="danger"
                    size={isMobile ? "sm" : "md"}
                    onClick={() => onDelete(todo._id, todo.title)}
                    title={isMobile ? undefined : "Delete Task"}
                    className="flex items-center gap-1"
                >
                    <Trash2 className={iconSizes} />
                    {isMobile && <span>Delete</span>}
                </Button>
            </div>
        );
    };

    return (
        <>
            <div className="overflow-hidden">
                <div className="block lg:hidden space-y-4 p-4">
                    {sortedTodos.map((todo) => {
                        const statusBadge = getStatusBadge(todo);
                        const isExpanded = expandedRows.has(todo._id);

                        return (
                            <div
                                key={todo._id}
                                className={`
                    bg-white rounded-xl border-2 shadow-sm transition-all duration-200
                    ${todo.status === 'completed' ? 'opacity-60 border-slate-200' : 'border-slate-200 hover:border-slate-300 hover:shadow-md'}
                  `}
                            >
                                <div className="p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 mt-1">
                                            {getStatusIcon(todo.status)}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-3 mb-2">
                                                <h3 className={`font-semibold text-slate-900 text-sm leading-tight ${todo.status === 'completed' ? 'line-through' : ''}`}>
                                                    {todo.title}
                                                </h3>
                                                <div className={`flex-shrink-0 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusBadge.color} border`}>
                                                    {statusBadge.text}
                                                </div>
                                            </div>

                                            {todo.description && (
                                                <p className="text-sm text-slate-500 mb-3 line-clamp-2">
                                                    {todo.description}
                                                </p>
                                            )}

                                            <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-1">
                                                        <User className="w-3 h-3" />
                                                        <span>{todo.assignedTo}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className={`w-3 h-3 ${statusBadge.variant === 'danger' ? 'text-red-500' :
                                                                statusBadge.variant === 'warning' ? 'text-amber-500' :
                                                                    'text-slate-400'
                                                            }`} />
                                                        <span className={
                                                            statusBadge.variant === 'danger' ? 'text-red-600 font-medium' :
                                                                statusBadge.variant === 'warning' ? 'text-amber-600 font-medium' :
                                                                    'text-slate-500'
                                                        }>
                                                            {formatDateShort(todo.dueDate)}
                                                        </span>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => toggleRowExpansion(todo._id)}
                                                    className="flex items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors"
                                                >
                                                    <Eye className="w-3 h-3" />
                                                    <span>{isExpanded ? 'Less' : 'More'}</span>
                                                </button>
                                            </div>

                                            <div className="flex items-center gap-2 mt-3">
                                                {renderActionButtons(todo, true)}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div className="border-t border-slate-100 p-4 bg-slate-50/50 rounded-b-xl">
                                        <div className="space-y-3 text-sm">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <span className="text-slate-500 font-medium">Assigned to:</span>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <div className="w-6 h-6 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center">
                                                            <User className="w-3 h-3 text-blue-600" />
                                                        </div>
                                                        <span className="text-slate-900">{todo.assignedTo}</span>
                                                    </div>
                                                    <div className="text-xs text-slate-500 mt-1">by {todo.assignedBy}</div>
                                                </div>

                                                <div>
                                                    <span className="text-slate-500 font-medium">Due Date:</span>
                                                    <div className="mt-1 text-slate-900">{formatDate(todo.dueDate)}</div>
                                                </div>
                                            </div>

                                            {todo.originatingIssue && (
                                                <div>
                                                    <span className="text-slate-500 font-medium">Origin Issue:</span>
                                                    <div className="mt-1 flex items-center gap-2">
                                                        <span className="text-slate-900">{todo.originatingIssue.title}</span>
                                                        {todo.originatingIssue.type && (
                                                            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${todo.originatingIssue.type === 'short'
                                                                    ? 'text-amber-700 bg-amber-50 border border-amber-200'
                                                                    : 'text-blue-700 bg-blue-50 border border-blue-200'
                                                                }`}>
                                                                {todo.originatingIssue.type === 'short' ? (
                                                                    <Target className="w-3 h-3 mr-1" />
                                                                ) : (
                                                                    <Calendar className="w-3 h-3 mr-1" />
                                                                )}
                                                                {todo.originatingIssue.type}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="hidden lg:block overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4" />
                                        <span>Status</span>
                                    </div>
                                </th>
                                <SortableHeader field="title">
                                    <div className="flex items-center gap-2">
                                        <Target className="w-4 h-4" />
                                        <span>Task</span>
                                    </div>
                                </SortableHeader>
                                <SortableHeader field="assignedTo">
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        <span>Assignee</span>
                                    </div>
                                </SortableHeader>
                                <SortableHeader field="dueDate">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>Due Date</span>
                                    </div>
                                </SortableHeader>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                                    <div className="flex items-center gap-2">
                                        <Target className="w-4 h-4" />
                                        <span>Origin Issue</span>
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {sortedTodos.map((todo) => {
                                const statusBadge = getStatusBadge(todo);
                                return (
                                    <tr
                                        key={todo._id}
                                        className={`
                        hover:bg-slate-50/50 transition-colors group
                        ${todo.status === 'completed' ? 'opacity-60' : ''}
                      `}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                {getStatusIcon(todo.status)}
                                                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusBadge.color} border`}>
                                                    {statusBadge.text}
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className={`font-semibold text-slate-900 max-w-xs ${todo.status === 'completed' ? 'line-through' : ''}`}>
                                                    {todo.title}
                                                </div>
                                                {todo.description && (
                                                    <div className="text-sm text-slate-500 max-w-xs truncate">
                                                        {todo.description}
                                                    </div>
                                                )}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center">
                                                        <User className="w-4 h-4 text-blue-600" />
                                                    </div>
                                                    <span className="text-sm font-medium text-slate-900">{todo.assignedTo}</span>
                                                </div>
                                                <div className="text-xs text-slate-500 ml-10">by {todo.assignedBy}</div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <Calendar className={`w-4 h-4 ${statusBadge.variant === 'danger' ? 'text-red-500' :
                                                        statusBadge.variant === 'warning' ? 'text-amber-500' :
                                                            statusBadge.variant === 'success' ? 'text-emerald-500' :
                                                                'text-slate-400'
                                                    }`} />
                                                <div className="space-y-1">
                                                    <div className={`text-sm font-medium ${statusBadge.variant === 'danger' ? 'text-red-600' :
                                                            statusBadge.variant === 'warning' ? 'text-amber-600' :
                                                                'text-slate-900'
                                                        }`}>
                                                        {formatDate(todo.dueDate)}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="space-y-2">
                                                <div className="text-sm font-medium text-slate-900 max-w-xs truncate">
                                                    {todo.originatingIssue?.title || 'N/A'}
                                                </div>
                                                {todo.originatingIssue?.type && (
                                                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${todo.originatingIssue.type === 'short'
                                                            ? 'text-amber-700 bg-amber-50 border border-amber-200'
                                                            : 'text-blue-700 bg-blue-50 border border-blue-200'
                                                        }`}>
                                                        {todo.originatingIssue.type === 'short' ? (
                                                            <Target className="w-3 h-3 mr-1" />
                                                        ) : (
                                                            <Calendar className="w-3 h-3 mr-1" />
                                                        )}
                                                        {todo.originatingIssue.type}
                                                    </div>
                                                )}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {renderActionButtons(todo, false)}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {showEditModal && createPortal(
                <TodoFormModal
                    isOpen={showEditModal}
                    onClose={() => {
                        setShowEditModal(false);
                        setEditingTodo(null);
                    }}
                    onSubmit={handleEditSubmit}
                    todo={editingTodo}
                    isLoading={isUpdating}
                />,
                document.body 
            )}
        </>
    );
}