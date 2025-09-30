import { useState, useCallback, useMemo } from 'react';

const MAX_SELECTION_LIMIT = 10;

export const useMultiSelection = () => {
  const [selectedItems, setSelectedItems] = useState(new Set());

  const toggleItem = useCallback((id) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        if (newSet.size >= MAX_SELECTION_LIMIT) {
          return prev;
        }
        newSet.add(id);
      }
      const items = Array.from(newSet);
      if (items.length > MAX_SELECTION_LIMIT) {
        return new Set(items.slice(0, MAX_SELECTION_LIMIT));
      }
      return newSet;
    });
  }, []);

  const selectAll = useCallback((items) => {
    const itemsToSelect = items.slice(0, MAX_SELECTION_LIMIT);
    setSelectedItems(new Set(itemsToSelect.map(item => item.id)));
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedItems(new Set());
  }, []);

  const selectedCount = useMemo(() => selectedItems.size, [selectedItems]);
  const selectedIds = useMemo(() => Array.from(selectedItems), [selectedItems]);
  const isAtLimit = useMemo(() => selectedItems.size >= MAX_SELECTION_LIMIT, [selectedItems]);

  const getSelectionForAPI = useCallback(() => ({
    selectedIds: Array.from(selectedItems)
  }), [selectedItems]);

  return {
    selectedIds,
    selectedCount,
    isAtLimit,
    maxSelectionLimit: MAX_SELECTION_LIMIT,
    toggleItem,
    selectAll,
    clearSelection,
    hasSelection: selectedCount > 0,
    getSelectionForAPI
  };
}; 