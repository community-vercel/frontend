import { useState, useCallback, useMemo } from 'react';

export function useFilters(initialFilters = {}) {
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    priority: '',
    ...initialFilters
  });

  const updateFilter = useCallback((field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      type: '',
      status: '',
      priority: '',
      ...initialFilters
    });
  }, [initialFilters]);

  const hasActiveFilters = useMemo(() => {
    return Object.values(filters).some(value => value !== '');
  }, [filters]);

  const buildQueryParams = useCallback(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    return params.toString();
  }, [filters]);

  return {
    filters,
    updateFilter,
    resetFilters,
    hasActiveFilters,
    buildQueryParams
  };
}