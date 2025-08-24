const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const fetchIssues = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const response = await fetch(`${API_BASE_URL}/issues?${query}`);
  if (!response.ok) throw new Error('Failed to fetch issues');
  return response.json();
};

export const fetchIssueById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/issues/${id}`);
  if (!response.ok) throw new Error('Failed to fetch issue');
  return response.json();
};

export const createIssue = async (data) => {
  const response = await fetch(`${API_BASE_URL}/issues`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create issue');
  return response.json();
};

export const updateIssue = async (id, data) => {
  const response = await fetch(`${API_BASE_URL}/issues/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update issue');
  return response.json();
};

export const deleteIssue = async (id) => {
  const response = await fetch(`${API_BASE_URL}/issues/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete issue');
  return response.json();
};

export const convertIssueToTodo = async (id, data) => {
  const response = await fetch(`${API_BASE_URL}/issues/${id}/convert-to-todo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to convert issue to to-do');
  return response.json();
};

export const moveIssueToLongTerm = async (id) => {
  const response = await fetch(`${API_BASE_URL}/issues/${id}/move-to-longterm`, {
    method: 'PUT',
  });
  if (!response.ok) throw new Error('Failed to move issue to long-term');
  return response.json();
};
export const moveIssueToShortTerm = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/issues/${id}/move-to-shortterm`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Failed to move issue to short-term');
    }
    return result;
  } catch (error) {
    console.error('Error in moveIssueToShortTerm:', error);
    throw error;
  }
};
export const fetchTodos = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const response = await fetch(`${API_BASE_URL}/todos?${query}`);
  if (!response.ok) throw new Error('Failed to fetch to-dos');
  return response.json();
};

export const createTodo = async (data) => {
  const response = await fetch(`${API_BASE_URL}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create to-do');
  return response.json();
};

export const updateTodo = async (id, data) => {
  const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update to-do');
  return response.json();
};

export const completeTodo = async (id) => {
  const response = await fetch(`${API_BASE_URL}/todos/${id}/complete`, {
    method: 'PUT',
  });
  if (!response.ok) throw new Error('Failed to complete to-do');
  return response.json();
};

export const deleteTodo = async (id) => {
  const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete to-do');
  return response.json();
};