import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { useLocation } from 'react-router-dom';
import _isEqual from 'lodash/isEqual';
import _isEmpty from 'lodash/isEmpty';
import { memoize } from 'proxy-memoize';
import * as Api from '../store/api';
import * as resourcesDucks from '../store/ducks/resources';
import useFilterable from './useFilterable';

export const useResource = ({
  autoFetch = false,
  resource,
  alias,
  resourceParams = {},
  preventParamsFromSearch,
  display = 'list',
  id: providedId,
  typeForm = '',
  readOnly = false
}) => {
  const location = useLocation();
  const aliasName = resource + (alias || '');
  const { find } = useFilterable(aliasName);
  const filters = find(aliasName);

  const [currentFilters, setCurrentFilters] = useState(filters);
  const [id, setId] = useState(providedId);
  const [providedResourceParams, setProvidedResourceParams] =
    useState(resourceParams);

  const stateToProps = useSelector(
    useCallback(
      memoize((state) => {
        const detailedRecord = providedId
          ? resourcesDucks.getDetailedRecord(
              state,
              aliasName,
              providedId,
              typeForm
            )
          : {};

        return {
          isLoading: resourcesDucks.isLoading(state, aliasName),
          isLoadingDetails: resourcesDucks.isLoadingDetails(state, aliasName),
          isCreating: resourcesDucks.isCreating(state, aliasName),

          records: resourcesDucks.getRecords(state, aliasName),
          detailedRecords: resourcesDucks.getDetailedRecords(state, aliasName),
          detailedRecord,
          pagination: resourcesDucks.getPagination(state, aliasName),

          errors: resourcesDucks.getErrors(state, aliasName),

          isRemoving: resourcesDucks.isRemoving(state, aliasName),
          removingRecords: resourcesDucks.getRemovingRecords(state, aliasName),
          removedRecord: resourcesDucks.getRemovedRecord(state, aliasName),

          isUpdating: resourcesDucks.isUpdating(state, aliasName),
          savingRecords: resourcesDucks.getSavingRecords(state, aliasName),
          savedRecord: resourcesDucks.getSavingRecord(state, aliasName),
        };
      }),
      [aliasName, providedId]
    )
  );

  const store = useStore();
  const dispatch = useDispatch();

  const actions = useMemo(
    () =>
      [
        'fetch',
        'details',
        'create',
        'updateRecord',
        'remove',
        'setRecords',
        'updateDetails'
      ].reduce((previousValue, currentValue) => {
        // eslint-disable-next-line no-param-reassign
        previousValue[currentValue] = (...args) =>
          dispatch(
            resourcesDucks[currentValue](
              {
                resource: aliasName,
                api: Api[resource]
              },
              ...args
            )
          );

        return previousValue;
      }, {}),
    [dispatch, aliasName, resource, display, typeForm]
  );

  const dispatchToProps = useMemo(
    () => ({
      registerResource: resourcesDucks.registerResource,
      ...actions
    }),
    [actions]
  );

  const buildSearchParams = useCallback(
    (searchProps, filters) => {
      if (preventParamsFromSearch) {
        return { ...searchProps, ...resourceParams };
      }

      const appliedFilters = find(aliasName);
      let newParams = {
        ...searchProps,
        ...resourceParams,
        ...filters
      };

      const allFilters = {};

      if (appliedFilters?.filters) {
        allFilters.filters = appliedFilters.filters;
      }

      if (appliedFilters?.dynamicFilters) {
        allFilters.dynamicFilters = appliedFilters.dynamicFilters;
      }

      if (appliedFilters?.sortField && appliedFilters?.sortDir) {
        allFilters.sorting = {
          field: appliedFilters.sortField,
          direction: appliedFilters.sortDir
        };
      }

      if (Object.keys(allFilters).length > 0) {
        newParams.filterFields = JSON.stringify(allFilters);
      }

      if (appliedFilters?.search) {
        newParams.search = appliedFilters.search;
      }

      if (appliedFilters?.pagination) {
        newParams.page = appliedFilters.pagination.page;
        newParams.perPage = appliedFilters.pagination.perPage;
      }

      if (appliedFilters?.searchTerm) {
        newParams.search = appliedFilters.searchTerm;
      }

      if (appliedFilters?.sortField && appliedFilters?.sortDir) {
        newParams.sortField = appliedFilters.sortField;
        newParams.sortDir = appliedFilters.sortDir;
      }

      // Date range functionality can be added later if needed

      return newParams;
    },
    [aliasName, preventParamsFromSearch, resourceParams, find]
  );

  const handleFetch = useCallback(
    (searchProps = {}, filters = {}) => {
      if (readOnly) {
        return;
      }

      const params = buildSearchParams(searchProps, filters);

      return providedId
        ? dispatchToProps.details(providedId, params)
        : dispatchToProps.fetch(params);
    },
    [providedId, readOnly, buildSearchParams, dispatchToProps]
  );

  useEffect(() => {
    dispatch(dispatchToProps.registerResource(aliasName));

    if (autoFetch) {
      handleFetch();
    }
  }, [aliasName, dispatch, dispatchToProps.registerResource, handleFetch, autoFetch]);

  useEffect(() => {
    const hasClearedFilters = _isEmpty(filters) && !_isEmpty(currentFilters);
    const hasUpdatedFilters =
      !_isEmpty(filters) &&
      !_isEqual(filters, currentFilters) &&
      !stateToProps.isLoading &&
      !providedId &&
      !preventParamsFromSearch;
    const hasUpdatedResourceParams =
      !_isEmpty(resourceParams) &&
      !_isEqual(resourceParams, providedResourceParams) &&
      !stateToProps.isLoading;
    const hasUpdatedId = providedId && providedId !== id;

    if (
      !stateToProps.isLoading &&
      (hasClearedFilters ||
        hasUpdatedFilters ||
        hasUpdatedResourceParams ||
        hasUpdatedId)
    ) {
      if (hasClearedFilters) {
        setCurrentFilters('');
      }

      if (hasUpdatedFilters) {
        setCurrentFilters(filters);
      }

      if (hasUpdatedResourceParams) {
        setProvidedResourceParams(resourceParams);
      }

      if (hasUpdatedId) {
        setId(providedId);
      }

      handleFetch();
    }
  }, [
    location.search,
    resourceParams,
    providedId,
    filters,
    currentFilters,
    stateToProps.isLoading
  ]);

  // Date range listener can be added later if needed

  return useMemo(
    () => ({
      ...stateToProps,
      ...dispatchToProps,
      handleFetch,
      autoFetch,
      resource,
      alias,
      aliasName,
      resourceParams,
      preventParamsFromSearch,
      id: providedId
    }),
    [
      stateToProps,
      dispatchToProps,
      handleFetch,
      autoFetch,
      resource,
      alias,
      aliasName,
      resourceParams,
      preventParamsFromSearch,
      providedId
    ]
  );
};
