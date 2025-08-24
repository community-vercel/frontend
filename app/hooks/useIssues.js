import { useState, useCallback, useRef } from 'react';
import { fetchIssues, createIssue, moveIssueToLongTerm, moveIssueToShortTerm } from '../lib/api';

export function useIssues() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const initialLoadComplete = useRef(false);

  const fetchIssuesData = useCallback(async (filters = {}) => {
    try {
      setLoading(!initialLoadComplete.current);
      const response = await fetchIssues(filters);
      const fetchedIssues = response.data || [];
      setIssues(fetchedIssues);
      initialLoadComplete.current = true;
      return fetchedIssues;
    } catch (error) {
      console.error('Error fetching issues:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const createNewIssue = useCallback(async (issueData) => {
    try {
      const response = await createIssue(issueData);
      await fetchIssuesData(); // Refresh the list
      return response;
    } catch (error) {
      throw error;
    }
  }, [fetchIssuesData]);

  const moveIssue = useCallback(async (issueId, targetType) => {
    try {
      // Optimistic update
      setIssues(prev => prev.map(issue => 
        String(issue._id) === String(issueId) 
          ? { ...issue, type: targetType }
          : issue
      ));

      if (targetType === 'long') {
        await moveIssueToLongTerm(issueId);
      } else {
        await moveIssueToShortTerm(issueId);
      }
    } catch (error) {
      // Revert on error
      await fetchIssuesData();
      throw error;
    }
  }, [fetchIssuesData]);

  const deleteIssue = useCallback((issueId) => {
    setIssues(prev => prev.filter(issue => issue._id !== issueId));
  }, []);

  const updateIssue = useCallback(() => {
    fetchIssuesData();
  }, [fetchIssuesData]);

  return {
    issues,
    loading,
    initialLoadComplete: initialLoadComplete.current,
    fetchIssuesData,
    createNewIssue,
    moveIssue,
    deleteIssue,
    updateIssue
  };
}