'use client';
import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Target } from 'lucide-react';
import { useFilters } from '../../hooks/useFilters';
import { useIssues } from '../../hooks/useIssues';
import PageHeader from '../issues/PageHeader';
import WorkflowInfo from '../issues/WorkflowInfo';
import FilterControls from '../issues/FilterControls';
import IssueStats from '../issues/IssueStats';
import ActionBar from '../issues/ActionBar';
import LoadingOverlay from '../issues/LoadingOverlay';
import IssuesBoard from '../issues/IssuesBoard';
import IssueFormModal from '../issues/IssueFormModal';
import ConfirmationModal from '../issues/ConfirmationModal';
import NotificationManager from '../issues/NotificationManager';
import EmptyState from '../issues/EmptyState';
import { applyFilters } from '../../utils/filterUtils';

// Create a component that uses useSearchParams
export default function IssuesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { filters, updateFilter, resetFilters, hasActiveFilters } = useFilters();
  const {
    issues,
    loading,
    initialLoadComplete,
    fetchIssuesData,
    createNewIssue,
    moveIssue,
    deleteIssue,
    updateIssue,
  } = useIssues();
  const [dragLoading, setDragLoading] = useState(false);
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
  }, [searchParams, router]);

  useEffect(() => {
    fetchIssuesData(filters).catch((error) => {
      notificationRef.current?.show('Failed to fetch issues', 'error');
    });
  }, [fetchIssuesData, filters]);

  useEffect(() => {
    if (initialLoadComplete) {
      const timeoutId = setTimeout(() => {
        fetchIssuesData(filters).catch((error) => {
          notificationRef.current?.show('Failed to apply filters', 'error');
        });
      }, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [filters, initialLoadComplete, fetchIssuesData]);

  const filteredIssues = applyFilters(issues, filters);
  const shortTermIssues = filteredIssues.filter((issue) => issue.type === 'short');
  const longTermIssues = filteredIssues.filter((issue) => issue.type === 'long');

  const handleCreateIssue = async (issueData) => {
    try {
      setIsCreating(true);
      await createNewIssue(issueData);
      setShowCreateModal(false);
      notificationRef.current?.show('Issue created successfully!', 'success');
    } catch (error) {
      throw new Error(error.message || 'Failed to create issue');
    } finally {
      setIsCreating(false);
    }
  };

  const handleFilterChange = useCallback(
    (field, value) => {
      if (dragLoading) {
        notificationRef.current?.show('Cannot change filters while dragging', 'error');
        return;
      }
      updateFilter(field, value);
    },
    [dragLoading, updateFilter]
  );

  const showConfirmModal = useCallback(
    (title, message, onConfirm) => {
      setConfirmModal({
        show: true,
        title,
        message,
        onConfirm,
        onCancel: () => {
          setConfirmModal((prev) => ({ ...prev, show: false }));
          fetchIssuesData(filters);
        },
        loading: false,
      });
    },
    [fetchIssuesData, filters]
  );

  const handleDragEnd = useCallback(
    async (result) => {
      const { destination, source, draggableId } = result;

      if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
        return;
      }

      if (!['short', 'long'].includes(destination.droppableId) || !['short', 'long'].includes(source.droppableId)) {
        console.error('Invalid droppableId:', { source: source.droppableId, destination: destination.droppableId });
        return;
      }

      const draggedIssue = issues.find((issue) => String(issue._id) === String(draggableId));
      if (!draggedIssue) {
        console.error('Dragged issue not found:', draggableId);
        return;
      }

      const isMovingToLongTerm = destination.droppableId === 'long';
      const title = isMovingToLongTerm ? 'Move to Long-Term?' : 'Move to Short-Term?';
      const message = isMovingToLongTerm
        ? 'This issue will be moved to long-term planning. Continue?'
        : 'This issue will be moved to short-term actions. Continue?';

      const handleConfirm = async () => {
        try {
          setConfirmModal((prev) => ({ ...prev, loading: true }));
          setDragLoading(true);

          await moveIssue(draggableId, destination.droppableId);

          const successMessage = isMovingToLongTerm
            ? 'Issue moved to Long-Term!'
            : 'Issue moved to Short-Term!';
          notificationRef.current?.show(successMessage, 'success');

          setConfirmModal((prev) => ({ ...prev, show: false }));
        } catch (error) {
          console.error('Error updating issue:', error);
          notificationRef.current?.show('Failed to move issue', 'error');
        } finally {
          setDragLoading(false);
        }
      };

      showConfirmModal(title, message, handleConfirm);
    },
    [issues, moveIssue, showConfirmModal]
  );

  if (loading && !initialLoadComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-blue-100"></div>
            <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-slate-600 font-medium">Loading your issues...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader onCreateClick={() => setShowCreateModal(true)} />
        <WorkflowInfo />
        <FilterControls
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={resetFilters}
          hasActiveFilters={hasActiveFilters}
          disabled={dragLoading}
        />
        <LoadingOverlay show={dragLoading} />
        {filteredIssues.length === 0 ? (
          <EmptyState
            title={hasActiveFilters ? 'No issues match your filters' : 'No issues yet'}
            description={hasActiveFilters ? 'Try adjusting your filter criteria' : 'Create your first issue to get started'}
            actionLabel="Create Issue"
            onAction={() => setShowCreateModal(true)}
            icon={Target}
            hasFilters={hasActiveFilters}
          />
        ) : (
          <IssuesBoard
            shortTermIssues={shortTermIssues}
            longTermIssues={longTermIssues}
            onDragEnd={handleDragEnd}
            onUpdate={updateIssue}
            onDelete={deleteIssue}
          />
        )}
        <IssueFormModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateIssue}
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

