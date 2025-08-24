export function applyTodoFilters(todos, filters, currentView) {
  let filtered = [...todos];

  if (currentView === 'my-todos') {
    filtered = filtered.filter(todo => todo.assignedTo === 'current_user');
  } else if (currentView === 'assigned-by-me') {
    filtered = filtered.filter(todo => todo.assignedBy === 'current_user');
  } else if (currentView === 'completed') {
    filtered = filtered.filter(todo => todo.status === 'completed');
  } else if (currentView === 'incomplete') {
    filtered = filtered.filter(todo => todo.status === 'pending' || todo.status === 'late');
  }

  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filtered = filtered.filter(todo =>
      todo.title?.toLowerCase().includes(searchTerm) ||
      todo.description?.toLowerCase().includes(searchTerm)
    );
  }

  if (filters.assignedTo) {
    const assignedTo = filters.assignedTo.toLowerCase();
    filtered = filtered.filter(todo =>
      todo.assignedTo?.toLowerCase().includes(assignedTo)
    );
  }

  if (filters.assignedBy) {
    const assignedBy = filters.assignedBy.toLowerCase();
    filtered = filtered.filter(todo =>
      todo.assignedBy?.toLowerCase().includes(assignedBy)
    );
  }

  if (filters.status) {
    filtered = filtered.filter(todo => todo.status === filters.status);
  }

  return filtered;
}