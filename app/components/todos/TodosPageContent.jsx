'use client';
import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ListTodo } from 'lucide-react';
import { useTodoFilters } from '../../hooks/useTodoFilters';
import { useTodos } from '../../hooks/useTodos';
import TodoPageHeader from '../todos/TodoPageHeader';
import ViewTabs from '../todos/ViewTabs';
import TodoFiltersSection from '../todos/TodoFiltersSection';
import TodoTableContainer from '../todos/TodoTableContainer';
import TodoFormModal from '../todos/TodoFormModal';
import ConfirmationModal from '../todos/ConfirmationModal';
import NotificationManager from '../todos/NotificationManager';
import LoadingScreen from '../todos/LoadingScreen';
import EmptyTodoState from '../todos/EmptyTodoState';
import { applyTodoFilters } from '../../utils/todoFilterUtils';

export default function TodosPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { filters, updateFilter, resetFilters, hasActiveFilters } = useTodoFilters();
  const {
    todos,
    loading,
    initialLoadComplete,
    fetchTodosData,
    createNewTodo,
    completeTodoItem,
    deleteTodoItem,
    updateTodo,
  } = useTodos();

  const [currentView, setCurrentView] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    title: '',
    message: '',
    onConfirm: null,
    onCancel: null,
    loading: false,
  });

  const hasProcessedCreateParam = useRef(false);
  const notificationRef = useRef(null);

  useEffect(() => {
    const createParam = searchParams.get('create');
    if (createParam === 'true' && !hasProcessedCreateParam.current) {
      hasProcessedCreateParam.current = true;
      setShowCreateModal(true);
      const newUrl = new URL(window.location);
      newUrl.searchParams.delete('create');
      router.replace(newUrl.pathname + newUrl.search, { scroll: false });
    }
  }, [router, searchParams]);

  useEffect(() => {
    fetchTodosData(filters, currentView).catch((error) => {
      notificationRef.current?.show('Failed to fetch todos', 'error');
    });
  }, [fetchTodosData, filters, currentView]);

  const handleCreateTodo = async (todoData) => {
    try {
      setIsCreating(true);
      await createNewTodo(todoData);
      setShowCreateModal(false);
      notificationRef.current?.show('Task created successfully!', 'success');
    } catch (error) {
      throw new Error(error.message || 'Failed to create task');
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditTodo = async (id, todoData) => {
    try {
      await updateTodo(id, todoData);
      notificationRef.current?.show('Task updated successfully!', 'success');
      await fetchTodosData(filters, currentView);
    } catch (error) {
      console.error('Error updating todo:', error);
      notificationRef.current?.show('Failed to update task', 'error');
      throw error;
    }
  };

  const handleFilterChange = useCallback(
    (field, value) => {
      updateFilter(field, value);
    },
    [updateFilter]
  );

  const handleViewChange = useCallback(
    (view) => {
      setCurrentView(view);
      resetFilters();
    },
    [resetFilters]
  );

  const showConfirmModal = useCallback((title, message, onConfirm) => {
    setConfirmModal({
      show: true,
      title,
      message,
      onConfirm,
      onCancel: () => setConfirmModal((prev) => ({ ...prev, show: false })),
      loading: false,
    });
  }, []);

  const handleTodoComplete = useCallback(
    async (id, title) => {
      const handleConfirm = async () => {
        try {
          setConfirmModal((prev) => ({ ...prev, loading: true }));
          await completeTodoItem(id);
          notificationRef.current?.show('Task completed successfully!', 'success');
          setConfirmModal((prev) => ({ ...prev, show: false }));
        } catch (error) {
          console.error('Error completing todo:', error);
          notificationRef.current?.show('Failed to complete task', 'error');
        }
      };

      showConfirmModal('Mark as Complete?', `Are you sure you want to mark "${title}" as completed?`, handleConfirm);
    },
    [completeTodoItem, showConfirmModal]
  );

  const handleTodoDelete = useCallback(
    async (id, title) => {
      const handleConfirm = async () => {
        try {
          setConfirmModal((prev) => ({ ...prev, loading: true }));
          await deleteTodoItem(id);
          notificationRef.current?.show('Task deleted successfully!', 'success');
          setConfirmModal((prev) => ({ ...prev, show: false }));
        } catch (error) {
          console.error('Error deleting todo:', error);
          notificationRef.current?.show('Failed to delete task', 'error');
        }
      };

      showConfirmModal(
        'Delete Task?',
        `Are you sure you want to delete "${title}"? This action cannot be undone.`,
        handleConfirm
      );
    },
    [deleteTodoItem, showConfirmModal]
  );

  if (loading && !initialLoadComplete) {
    return <LoadingScreen />;
  }

  const filteredTodos = applyTodoFilters(todos, filters, currentView);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TodoPageHeader onCreateClick={() => setShowCreateModal(true)} />
        <ViewTabs todos={todos} currentView={currentView} onViewChange={handleViewChange} />
        <TodoFiltersSection
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={resetFilters}
          hasActiveFilters={hasActiveFilters}
        />
        {filteredTodos.length === 0 ? (
          <EmptyTodoState
            hasFilters={hasActiveFilters}
            currentView={currentView}
            onCreateClick={() => setShowCreateModal(true)}
          />
        ) : (
          <TodoTableContainer
            todos={filteredTodos}
            onEdit={handleEditTodo}
            onDelete={handleTodoDelete}
            onComplete={handleTodoComplete}
            onUpdate={fetchTodosData}
          />
        )}
        <TodoFormModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateTodo}
          isLoading={isCreating}
        />
        <ConfirmationModal
          isOpen={confirmModal.show}
          title={confirmModal.title}
          message={confirmModal.message}
          onConfirm={confirmModal.onConfirm}
          onCancel={confirmModal.onCancel}
          loading={confirmModal.loading}
        />
        <NotificationManager ref={notificationRef} />
      </div>
    </div>
  );
}

