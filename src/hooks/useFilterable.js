import { useSearchParams } from "react-router-dom";
import { useEffect, useState, useCallback, useMemo } from "react";
import _isEmpty from "lodash/isEmpty";
import _isEqual from "lodash/isEqual";

const useFilterable = (resourceName, alias = "") => {
  const resource = resourceName + alias;
  let [searchParams, setSearchParams] = useSearchParams();
  let [filters, setFilters] = useState([]);

  const parseFilter = useCallback((filter) => {
    try {
      return JSON.parse(window.atob(filter));
    } catch (e) {
      return {};
    }
  }, []);

  const getAll = useCallback(() => {
    let filters = searchParams.get("filters") || {};
    if (!_isEmpty(filters)) {
      filters = parseFilter(filters);
    }
    return filters;
  }, [searchParams, parseFilter]);

  const find = useCallback(
    (resource) => {
      const filters = getAll();
      return filters[resource];
    },
    [getAll]
  );

  const buildFilters = useCallback(
    (currentFilters, isPaginationUpdate = false) => {
      const newParams = {
        ...searchParams,
      };

      let pagination = currentFilters[resource]?.pagination;
      if (!isPaginationUpdate && pagination) {
        pagination.page = 1;
      }

      if (!_isEmpty(currentFilters)) {
        newParams.filters = window.btoa(JSON.stringify(currentFilters));
      }

      return {
        query: _isEmpty(newParams) ? "" : newParams,
        filters: currentFilters[resource],
      };
    },
    [searchParams, resource]
  );

  const handleUpdate = useCallback(
    (currentFilters, isPaginationUpdate = false) => {
      const { query, filters } = buildFilters(currentFilters, isPaginationUpdate);
      setSearchParams(query);
      setFilters(filters);
    },
    [buildFilters, setSearchParams]
  );

  const findFiltersUpdate = useCallback(
    (newFilters) => {
      let filters = getAll();

      if (!_isEmpty(newFilters)) {
        if (filters[resource]) {
          filters[resource].filters = newFilters;
        } else {
          filters[resource] = { filters: newFilters };
        }
      } else {
        if (filters[resource]) {
          delete filters[resource].filters;
          if (_isEmpty(filters[resource])) {
            delete filters[resource];
          }
        }
      }
      return filters;
    },
    [getAll, resource]
  );

  const update = useCallback(
    (newFilters) => {
      const filters = findFiltersUpdate(newFilters);
      handleUpdate(filters);
    },
    [findFiltersUpdate, handleUpdate]
  );

  const buildQueryString = useCallback(
    (newFilters, period = undefined) => {
      const filters = findFiltersUpdate(newFilters);
      if (!_isEmpty(filters) && period) {
        filters[resource].period = { ...period, index: 7 };
      } else if (_isEmpty(filters) && period) {
        filters[resource] = {
          period: { ...period, index: 7 },
        };
      }
      const { query } = buildFilters(filters);
      return query;
    },
    [findFiltersUpdate, buildFilters, resource]
  );

  const updatePagination = useCallback(
    ({ page, perPage }) => {
      const filters = getAll();
      if (filters[resource]) {
        filters[resource].pagination = { page, perPage };
      } else {
        filters[resource] = { pagination: { page, perPage } };
      }

      handleUpdate(filters, true);
    },
    [getAll, resource, handleUpdate]
  );

  const updatePeriod = useCallback(
    ({ beginDate, endDate, index }) => {
      const filters = getAll();
      filters[resource] = {
        ...filters[resource],
        period: { beginDate, endDate, index, __forceUpdate: Date.now() },
      };
      handleUpdate(filters);
    },
    [getAll, resource, handleUpdate]
  );

  const updateSearchTerm = useCallback(
    (searchTerm) => {
      const filters = getAll();
      if (filters[resource]) {
        if (!searchTerm) {
          delete filters[resource].searchTerm;
        } else {
          filters[resource].searchTerm = searchTerm;
        }
      } else {
        filters[resource] = { searchTerm };
      }

      handleUpdate(filters);
    },
    [getAll, resource, handleUpdate]
  );

  const updateSorting = useCallback(
    (sortField, sortDir) => {
      const filters = getAll();
      const filter = filters[resource];
      if (!filter && !sortField) {
        return;
      }

      if (filter) {
        if (!sortField && !sortDir) {
          delete filter.sortField;
          delete filter.sortDir;
        } else {
          filter.sortField = sortField;
          filter.sortDir = sortDir;
        }
      } else {
        filters[resource] = { sortField, sortDir };
      }

      handleUpdate(filters);
    },
    [getAll, resource, handleUpdate]
  );

  const updateDynamicFilters = useCallback(
    (dynamicFilters) => {
      const filters = getAll();
      if (filters[resource]) {
        filters[resource].dynamicFilters = dynamicFilters;
      } else {
        filters[resource] = { dynamicFilters };
      }
      handleUpdate(filters);
    },
    [getAll, resource, handleUpdate]
  );

  const updateTableSorting = useCallback(
    (sortingArray) => {
      const filters = getAll();
      const filter = filters[resource] || {};
      
      if (sortingArray && sortingArray.length > 0) {
        const sort = sortingArray[0];
        filter.sortField = sort.id;
        filter.sortDir = sort.desc ? 'desc' : 'asc';
      } else {
        delete filter.sortField;
        delete filter.sortDir;
      }

      filters[resource] = filter;
      handleUpdate(filters);
    },
    [getAll, resource, handleUpdate]
  );

  const clear = useCallback(() => {
    let currentFilters = getAll();
    if (currentFilters[resource]?.filters) {
      delete currentFilters[resource].filters;
    }

    handleUpdate(currentFilters);
  }, [getAll, resource, handleUpdate]);

  useEffect(() => {
    const appliedFilters = find(resource);
    if (!_isEqual(appliedFilters, filters)) {
      setFilters(appliedFilters);
    }
  }, [searchParams, resource, filters, find]);

  return useMemo(
    () => ({
      parseFilter,
      filters,
      find,
      clear,
      buildQueryString,
      update,
      updatePagination,
      updateSearchTerm,
      updateSorting,
      updatePeriod,
      updateDynamicFilters,
      updateTableSorting,
    }),
    [
      parseFilter,
      filters,
      find,
      clear,
      buildQueryString,
      update,
      updatePagination,
      updateSearchTerm,
      updateSorting,
      updatePeriod,
      updateDynamicFilters,
      updateTableSorting,
    ]
  );
};

export default useFilterable;

