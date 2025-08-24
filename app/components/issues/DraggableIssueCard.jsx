'use client';
import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  GripVertical, 
  Trash2, 
  CheckCircle2, 
  Calendar,
  User,
  AlertTriangle,
  Clock,
  Zap,
  ArrowRight,
  X
} from 'lucide-react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { convertIssueToTodo, deleteIssue, moveIssueToLongTerm } from '../../lib/api';
import ConvertToTodoModal from './ConvertToTodoModal';

import DeleteConfirmationModal from './DeleteModal'
import MoveToLongTermModal from './MoveModal'


export default function DraggableIssueCard({ issue, index, onUpdate, onDelete }) {
  const [isConverting, setIsConverting] = useState(false);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMoving, setIsMoving] = useState(false);

  console.log('DraggableIssueCard ID:', String(issue._id));

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: String(issue._id),
    data: { sortable: { containerId: issue.type, index } },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...(isDragging ? { zIndex: 1000, position: 'relative' } : {}),
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteIssue(issue._id);
      setShowDeleteModal(false);
      onDelete?.(issue._id);
    } catch (error) {
      console.error('Error deleting issue:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleConvertToTodo = async (todoData) => {
    try {
      setIsConverting(true);
      await convertIssueToTodo(issue._id, todoData);
      setShowConvertModal(false);
      onUpdate?.();
    } catch (error) {
      console.error('Error converting issue to todo:', error);
      throw error;
    } finally {
      setIsConverting(false);
    }
  };

  const handleMoveToLongTerm = async () => {
    try {
      setIsMoving(true);
      await moveIssueToLongTerm(issue._id);
      setShowMoveModal(false);
      onUpdate?.();
    } catch (error) {
      console.error('Error moving issue to long-term:', error);
    } finally {
      setIsMoving(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getPriorityConfig = (priority) => {
    switch (priority) {
      case 'critical':
        return {
          borderColor: 'border-l-red-500',
          bgColor: 'from-red-50 to-pink-50',
          textColor: 'text-red-700',
          badgeColor: 'bg-red-100 text-red-700 border-red-200',
          icon: <AlertTriangle className="w-4 h-4 text-red-500" />,
          animate: 'animate-pulse'
        };
      case 'high':
        return {
          borderColor: 'border-l-orange-500',
          bgColor: 'from-orange-50 to-amber-50',
          textColor: 'text-orange-700',
          badgeColor: 'bg-orange-100 text-orange-700 border-orange-200',
          icon: <Zap className="w-4 h-4 text-orange-500" />,
          animate: ''
        };
      case 'medium':
        return {
          borderColor: 'border-l-yellow-500',
          bgColor: 'from-yellow-50 to-lime-50',
          textColor: 'text-yellow-700',
          badgeColor: 'bg-yellow-100 text-yellow-700 border-yellow-200',
          icon: <Clock className="w-4 h-4 text-yellow-500" />,
          animate: ''
        };
      case 'low':
        return {
          borderColor: 'border-l-slate-400',
          bgColor: 'from-slate-50 to-slate-100',
          textColor: 'text-slate-700',
          badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
          icon: <Clock className="w-4 h-4 text-slate-400" />,
          animate: ''
        };
      default:
        return {
          borderColor: 'border-l-blue-400',
          bgColor: 'from-blue-50 to-indigo-50',
          textColor: 'text-blue-700',
          badgeColor: 'bg-blue-100 text-blue-700 border-blue-200',
          icon: <Clock className="w-4 h-4 text-blue-400" />,
          animate: ''
        };
    }
  };

  const priorityConfig = getPriorityConfig(issue.priority);

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`
          group relative bg-gradient-to-r ${priorityConfig.bgColor} backdrop-blur-sm rounded-2xl shadow-md border-2 border-l-4 p-6 mb-4
          transition-all duration-300 cursor-grab active:cursor-grabbing
          ${priorityConfig.borderColor}
          ${isDragging 
            ? 'shadow-2xl transform rotate-1 scale-105 bg-gradient-to-r from-blue-100 to-indigo-100 border-blue-400 z-50' 
            : 'hover:shadow-xl hover:-translate-y-2 hover:scale-[1.02]'
          }
          ${priorityConfig.animate}
        `}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="flex flex-col items-center gap-2 pt-1">
              <GripVertical className="w-5 h-5 text-slate-400 hover:text-slate-600 transition-colors cursor-grab" />
              <div className="opacity-80">
                {priorityConfig.icon}
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-slate-800 mb-2 leading-tight group-hover:text-slate-900 line-clamp-2">
                {issue.title}
              </h3>
            </div>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteModal(true);
            }}
            className="w-8 h-8 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 flex items-center justify-center"
            title="Delete issue"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${priorityConfig.badgeColor}`}>
            {priorityConfig.icon}
            <span>{issue.priority.toUpperCase()}</span>
          </div>
          
          <Badge 
            variant={issue.status === 'open' ? 'primary' : 'success'}
            className="bg-white/80 border font-medium"
          >
            {issue.status === 'open' ? (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>OPEN</span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>RESOLVED</span>
              </div>
            )}
          </Badge>
          
          {isDragging && (
            <div className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold animate-bounce">
              <ArrowRight className="w-3 h-3" />
              <span>MOVING</span>
            </div>
          )}
        </div>

        {issue.description && (
          <div className="mb-4">
            <div className="bg-white/70 backdrop-blur-sm border border-white/80 rounded-xl p-4 shadow-sm">
              <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                {issue.description}
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center text-sm mb-4">
          <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/80">
            <div className="w-8 h-8 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-slate-600" />
            </div>
            <span className="font-medium text-slate-700">{issue.createdBy}</span>
          </div>
          
          <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/80">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span className="text-slate-600 font-medium">{formatDate(issue.createdAt)}</span>
          </div>
        </div>

        {issue.status === 'open' && issue.type === 'short' && !isDragging && (
          <div className="flex gap-2">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                setShowConvertModal(true);
              }}
              disabled={isConverting}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              {isConverting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Converting...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>→ Todo</span>
                </div>
              )}
            </Button>
            
            <Button
              onClick={(e) => {
                e.stopPropagation();
                setShowMoveModal(true);
              }}
              className="flex-1 bg-gradient-to-r from-slate-400 to-slate-900 hover:from-slate-300 hover:to-slate-400 text-slate-700 font-semibold border border-slate-300 transform hover:scale-105 transition-all duration-200"
            >
              <div className="flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>→ Long-term</span>
              </div>
            </Button>
          </div>
        )}

        {isDragging && (
          <div className="absolute -top-4 -right-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs px-4 py-2 rounded-full shadow-xl animate-bounce border-2 border-white">
            <div className="flex items-center gap-2">
              <ArrowRight className="w-3 h-3" />
              <span className="font-bold">Drop to move!</span>
            </div>
          </div>
        )}

        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/0 to-indigo-400/0 group-hover:from-blue-400/10 group-hover:to-indigo-400/10 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none"></div>
      </div>

      {showConvertModal && (
        <ConvertToTodoModal
          isOpen={showConvertModal}
          onClose={() => setShowConvertModal(false)}
          onConvert={handleConvertToTodo}
          issue={issue}
          isLoading={isConverting}
        />
      )}

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        issueTitle={issue.title}
      />

      <MoveToLongTermModal
        isOpen={showMoveModal}
        onClose={() => setShowMoveModal(false)}
        onConfirm={handleMoveToLongTerm}
        isMoving={isMoving}
        issueTitle={issue.title}
      />
    </>
  );
}