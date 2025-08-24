import { useState, useCallback, useRef } from 'react';
import { fetchTodos, createTodo, updateTodo, completeTodo, deleteTodo } from '../lib/api';

export function useTodos() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const initialLoadComplete = useRef(false);

  const fetchTodosData = useCallback(async (filters = {}, currentView = 'all') => {
    try {
      setLoading(!initialLoadComplete.current);
            let queryFilters = { ...filters };
      if (currentView === 'my-todos') {
        queryFilters.assignedTo = 'current_user';
      } else if (currentView === 'assigned-by-me') {
        queryFilters.assignedBy = 'current_user';
      } else if (currentView === 'completed') {
        queryFilters.status = 'completed';
      } else if (currentView === 'incomplete') {
        queryFilters.status = 'pending';
      }
      
      const response = await fetchTodos(queryFilters);
      const fetchedTodos = response.data || [];
      setTodos(fetchedTodos);
      initialLoadComplete.current = true;
      return fetchedTodos;
    } catch (error) {
      console.error('Error fetching todos:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const createNewTodo = useCallback(async (todoData) => {
    try {
      const response = await createTodo(todoData);
      await fetchTodosData(); 
      return response;
    } catch (error) {
      throw error;
    }
  }, [fetchTodosData]);

  const updateTodoItem = useCallback(async (id, todoData) => {
    try {
      const updatedTodo = await updateTodo(id, todoData); 
      setTodos((prev) =>
        prev.map((todo) =>
          todo._id === id ? { ...todo, ...updatedTodo } : todo
        )
      );
      return updatedTodo;
    } catch (error) {
      console.error('Error updating todo:', error);
      await fetchTodosData();
      throw error;
    }
  }, [fetchTodosData]);

  const completeTodoItem = useCallback(async (todoId) => {
    try {
      await completeTodo(todoId);
      setTodos((prev) =>
        prev.map((todo) =>
          todo._id === todoId
            ? { ...todo, status: 'completed', completedAt: new Date().toISOString() }
            : todo
        )
      );
    } catch (error) {
      await fetchTodosData();
      throw error;
    }
  }, [fetchTodosData]);

  const deleteTodoItem = useCallback(async (todoId) => {
    try {
      await deleteTodo(todoId);
      setTodos((prev) => prev.filter((todo) => todo._id !== todoId));
    } catch (error) {
      await fetchTodosData();
      throw error;
    }
  }, [fetchTodosData]);

  return {
    todos,
    loading,
    initialLoadComplete: initialLoadComplete.current,
    fetchTodosData,
    createNewTodo,
    updateTodo: updateTodoItem, 
    completeTodoItem,
    deleteTodoItem,
  };
}