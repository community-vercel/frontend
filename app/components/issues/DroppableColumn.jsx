'use client';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Target, Calendar, Package } from 'lucide-react';
import DraggableIssueCard from './DraggableIssueCard';

export default function DroppableColumn({
  columnId,
  title,
  icon,
  issues,
  onUpdate,
  onDelete,
  emptyMessage,
  emptySubMessage,
  className,
  headerColor,
  isDropDisabled = false,
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: columnId,
    disabled: isDropDisabled,
    data: {
      type: 'column',
      droppableId: columnId,
    },
  });

  const getColumnStyles = () => {
    const baseStyles = "relative h-full min-h-[600px] rounded-2xl border-2 transition-all duration-300 bg-white/80 backdrop-blur-sm";
    
    if (isOver) {
      return `${baseStyles} border-blue-400 bg-blue-50/90 shadow-2xl scale-[1.02] transform`;
    }
    
    if (className) {
      return `${baseStyles} ${className} shadow-lg hover:shadow-xl`;
    }
    
    if (columnId === 'short') {
      return `${baseStyles} border-amber-200 bg-gradient-to-b from-amber-50/60 to-orange-50/40 hover:border-amber-300 shadow-lg`;
    } else {
      return `${baseStyles} border-blue-200 bg-gradient-to-b from-blue-50/60 to-indigo-50/40 hover:border-blue-300 shadow-lg`;
    }
  };

  const getHeaderStyles = () => {
    if (headerColor) {
      return `bg-gradient-to-r ${headerColor}`;
    }
    if (columnId === 'short') {
      return "bg-gradient-to-r from-amber-500 to-orange-600";
    } else {
      return "bg-gradient-to-r from-blue-500 to-indigo-600";
    }
  };

  const getIcon = () => {
    if (icon) return icon;
    return columnId === 'short' ? <Target className="w-5 h-5" /> : <Calendar className="w-5 h-5" />;
  };

  return (
    <div className={getColumnStyles()}>
      <div className={`${getHeaderStyles()} text-white p-6 rounded-t-2xl shadow-lg`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30">
              {getIcon()}
            </div>
            <div>
              <h3 className="text-xl font-bold">{title}</h3>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-1">
                  <Package className="w-4 h-4 opacity-80" />
                  <span className="text-sm opacity-90 font-medium">{issues.length} items</span>
                </div>
                {isOver && (
                  <div className="flex items-center gap-2 bg-white/25 px-3 py-1 rounded-full animate-pulse border border-white/40">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                    <span className="text-xs font-semibold">Drop Zone Active</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {isOver && (
            <div className="animate-bounce">
              <div className="w-10 h-10 bg-white/30 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/40">
                <span className="text-xl">⬇</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {isOver && (
        <div className="absolute inset-x-4 top-24 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full animate-pulse shadow-lg z-10"></div>
      )}

      <div 
        ref={setNodeRef}
        className="p-6 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent"
        style={{ maxHeight: 'calc(100% - 120px)' }}
      >
        <SortableContext 
          items={issues.map(issue => issue._id)} 
          strategy={verticalListSortingStrategy}
        >
          {issues.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] space-y-8">
              <div className="text-center space-y-6">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center shadow-inner border border-slate-200">
                  {columnId === 'short' ? (
                    <Target className="w-12 h-12 text-slate-400" />
                  ) : (
                    <Calendar className="w-12 h-12 text-slate-400" />
                  )}
                </div>
                
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-slate-600">{emptyMessage}</h4>
                  <p className="text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
                    {emptySubMessage}
                  </p>
                </div>
                
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-pulse delay-150"></div>
                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-pulse delay-300"></div>
                </div>
              </div>

              {isOver && (
                <div className="w-full max-w-sm mx-auto p-6 border-2 border-dashed border-blue-400 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 backdrop-blur-sm animate-pulse">
                  <div className="flex items-center justify-center gap-3 text-blue-600">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Package className="w-4 h-4" />
                    </div>
                    <span className="font-semibold">Drop your issue here</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {issues.map((issue, index) => (
                <DraggableIssueCard
                  key={issue._id}
                  issue={issue}
                  index={index}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                />
              ))}
              
              {isOver && (
                <div className="w-full p-4 border-2 border-dashed border-blue-400 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 backdrop-blur-sm animate-pulse">
                  <div className="flex items-center justify-center gap-3 text-blue-600">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm">⬇</span>
                    </div>
                    <span className="font-medium">Drop below existing items</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </SortableContext>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-sm border-t border-slate-200 rounded-b-2xl">
        <div className="flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${columnId === 'short' ? 'bg-amber-400' : 'bg-blue-400'}`}></div>
            <span className="font-medium">
              {columnId === 'short' ? 'Ready for action' : 'Strategic planning'}
            </span>
          </div>
          <div className="bg-slate-100 px-3 py-1 rounded-full font-mono font-bold">
            {issues.length}
          </div>
        </div>
      </div>
    </div>
  );
}