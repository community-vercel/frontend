import { memo } from 'react';
import TodoTable from '../todos/TodoTable';

const TodoTableContainer = memo(function TodoTableContainer({ 
  todos, 
  onEdit, 
  onDelete, 
  onComplete 
}) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border overflow-hidden">
      <TodoTable
        todos={todos}
        onEdit={onEdit}
        onDelete={(id) => {
          const todo = todos.find(t => t._id === id);
          onDelete(id, todo?.title || 'Untitled Task');
        }}
        onComplete={(id) => {
          const todo = todos.find(t => t._id === id);
          onComplete(id, todo?.title || 'Untitled Task');
        }}
      />
    </div>
  );
});

export default TodoTableContainer