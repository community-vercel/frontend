import { Target, Calendar } from 'lucide-react';
import DragContextWrapper from '../DragContextWrapper';
import DroppableColumn from './DroppableColumn';

export default function IssuesBoard({ 
  shortTermIssues, 
  longTermIssues, 
  onDragEnd, 
  onUpdate, 
  onDelete 
}) {
  return (
    <DragContextWrapper onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <DroppableColumn
          columnId="short"
          title="Short-term Issues"
          icon={<Target className="w-5 h-5" />}
          issues={shortTermIssues}
          onUpdate={onUpdate}
          onDelete={onDelete}
          emptyMessage="No short-term issues"
          emptySubMessage="Create a new issue or drag from long-term"
          className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200"
          headerColor="from-amber-500 to-orange-600"
        />
        <DroppableColumn
          columnId="long"
          title="Long-term Issues"
          icon={<Calendar className="w-5 h-5" />}
          issues={longTermIssues}
          onUpdate={onUpdate}
          onDelete={onDelete}
          emptyMessage="No long-term issues"
          emptySubMessage="Drag short-term issues here for planning"
          className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200"
          headerColor="from-blue-500 to-indigo-600"
        />
      </div>
    </DragContextWrapper>
  );
}