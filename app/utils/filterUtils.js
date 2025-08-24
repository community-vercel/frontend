export function applyFilters(items, filters) {
  return items.filter(item => {
    if (filters.type && item.type !== filters.type) {
      return false;
    }
    
    if (filters.status && item.status !== filters.status) {
      return false;
    }
    
    if (filters.priority && item.priority !== filters.priority) {
      return false;
    }
    
    return true;
  });
}

export function getFilterSummary(filters) {
  const active = Object.entries(filters)
    .filter(([_, value]) => value !== '')
    .map(([key, value]) => ({ key, value }));
    
  if (active.length === 0) return 'All items';
  
  const parts = active.map(({ key, value }) => {
    const label = key.charAt(0).toUpperCase() + key.slice(1);
    return `${label}: ${value}`;
  });
  
  return parts.join(', ');
}
