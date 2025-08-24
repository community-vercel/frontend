import { useState, useCallback, useMemo } from 'react';

export function useTodoFilters(initialFilters = {}) {
  const [filters, setFilters] = useState({
    assignedTo: '',
    assignedBy: '',
    status: '',
    search: '',
    ...initialFilters
  });

  const updateFilter = useCallback((field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      assignedTo: '',
      assignedBy: '',
      status: '',
      search: '',
      ...initialFilters
    });
  }, [initialFilters]);

  const hasActiveFilters = useMemo(() => {
    return Object.values(filters).some(value => value !== '');
  }, [filters]);

  return {
    filters,
    updateFilter,
    resetFilters,
    hasActiveFilters
  };
}
