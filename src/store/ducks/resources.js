/**
 * Dependencies.
 */

import update from 'immutability-helper';
import objectPath from 'object-path';
import createActionTypes from '../utils/createActionTypes';
import createReducer from '../utils/createReducer';
import resolve from '../../utils/resolve';

/**
 * Action Types.
 */

const actionTypes = createActionTypes('resources', [
  'FETCH_LIST',
  'FETCH_LIST_PENDING',
  'FETCH_LIST_FULFILLED',
  'FETCH_LIST_REJECTED',

  'DETAILS',
  'DETAILS_PENDING',
  'DETAILS_FULFILLED',
  'DETAILS_REJECTED',

  'CREATE',
  'CREATE_PENDING',
  'CREATE_FULFILLED',
  'CREATE_REJECTED',

  'UPDATE',
  'UPDATE_PENDING',
  'UPDATE_FULFILLED',
  'UPDATE_REJECTED',

  'REMOVE',
  'REMOVE_PENDING',
  'REMOVE_FULFILLED',
  'REMOVE_REJECTED',

  'CLONE',
  'CLONE_PENDING',
  'CLONE_FULFILLED',
  'CLONE_REJECTED',

  'REGISTER_RESOURCE',
  'UPDATE_RECORDS',
  'UPDATE_DETAILS'
]);

/**
 * Initial State.
 */

const initialState = {
  isLoading: true,
  isLoadingDetails: false,
  records: [],
  detailedRecords: [],
  pagination: {
    current_page: 1,
    per_page: 10,
    total: 0
  },

  errors: {},

  isUpdating: false,
  savedRecord: {},
  savingRecords: [],

  removedRecord: {},
  removingRecords: [],
  isRemoving: false,

  isCloning: false,
  clonedRecords: [],
  cloningRecords: []
};

/**
 * Reducer.
 */

export default createReducer(
  {},
  {
    [actionTypes.REGISTER_RESOURCE](state, { payload: { resource } }) {
      return update(state, {
        [resource]: { $set: { ...initialState, isLoading: false } }
      });
    },

    [actionTypes.UPDATE_RECORDS](
      state,
      { payload: { records }, meta: { resource } }
    ) {
      return update(state, {
        [resource]: {
          records: { $set: records }
        }
      });
    },

    [actionTypes.FETCH_LIST_PENDING](state, { meta: { resource } }) {
      return update(state, {
        [resource]: {
          isLoading: { $set: true },
          errors: { $set: {} }
        }
      });
    },
    [actionTypes.FETCH_LIST_FULFILLED](
      state,
      {
        payload: {
          data: { data, meta }
        },
        meta: { resource }
      }
    ) {
      return update(state, {
        [resource]: {
          isLoading: { $set: false },
          records: { $set: data },
          pagination: {
            $set: {
              total: meta?.total || 0,
              current_page: meta?.current_page || 1,
              per_page: meta?.per_page || 10
            }
          }
        }
      });
    },
    [actionTypes.FETCH_LIST_REJECTED](state, { meta: { resource } }) {
      return update(state, {
        [resource]: {
          isLoading: { $set: false }
        }
      });
    },

    /**
     * Details
     */
    [actionTypes.DETAILS_PENDING](state, { meta: { resource } }) {
      return update(state, {
        [resource]: {
          isLoadingDetails: { $set: true },
          errors: { $set: {} }
        }
      });
    },
    [actionTypes.DETAILS_FULFILLED](
      state,
      {
        payload: {
          data: { data }
        },
        meta: { resource, id }
      }
    ) {
      return update(state, {
        [resource]: {
          isLoadingDetails: { $set: false },
          detailedRecords: {
            [id]: { $set: data }
          }
        }
      });
    },
    [actionTypes.DETAILS_REJECTED](state, { meta: { resource, id } }) {
      return update(state, {
        [resource]: {
          isLoadingDetails: { $set: false },
          detailedRecords: {
            [id]: { $set: {} }
          }
        }
      });
    },

    /**
     * Create
     */
    [actionTypes.CREATE_PENDING](state, { meta: { resource } }) {
      return update(state, {
        [resource]: {
          isCreating: { $set: true },
          errors: { $set: {} }
        }
      });
    },

    [actionTypes.CREATE_FULFILLED](
      state,
      {
        payload: {
          data: { data }
        },
        meta: { resource }
      }
    ) {
      if (!data) {
        return update(state, {
          [resource]: {
            isCreating: { $set: false }
          }
        });
      }

      return update(state, {
        [resource]: {
          isCreating: { $set: false },
          records: { $unshift: [data] },
          detailedRecords: { [data.id]: { $set: data } }
        }
      });
    },

    [actionTypes.CREATE_REJECTED](state, { payload, meta: { resource } }) {
      return update(state, {
        [resource]: {
          isCreating: { $set: false },
          errors: { $set: objectPath.get(payload, `response.data.errors`, []) }
        }
      });
    },

    /**
     * Update.
     */

    [actionTypes.UPDATE_DETAILS](
      state,
      { payload: data, meta: { resource, id } }
    ) {
      return update(state, {
        [resource]: {
          detailedRecords: { [id]: { $set: data } },
          records: {
            $apply: (records) =>
              records.map((r) => {
                if (r.id === data.id) {
                  return data;
                }

                return r;
              })
          }
        }
      });
    },

    [actionTypes.UPDATE_PENDING](state, { meta: { resource, id } }) {
      return update(state, {
        [resource]: {
          isUpdating: { $set: true },
          savingRecords: { $push: [id] },
          errors: { $set: {} }
        }
      });
    },

    [actionTypes.UPDATE_FULFILLED](
      state,
      {
        payload: {
          data: { data }
        },
        meta: { resource, id }
      }
    ) {
      return update(state, {
        [resource]: {
          savingRecords: {
            $apply: (records) => records.filter((r) => r !== id)
          },
          isUpdating: { $set: false },
          detailedRecords: { [data.id]: { $set: data } },
          records: {
            $apply: (records) =>
              records.map((r) => {
                if (r.id === data.id) {
                  return data;
                }
                return r;
              })
          }
        }
      });
    },

    [actionTypes.UPDATE_REJECTED](state, { payload, meta: { resource, id } }) {
      return update(state, {
        [resource]: {
          savingRecords: {
            $apply: (records) => records.filter((r) => r !== id)
          },
          isUpdating: { $set: false },
          errors: { $set: objectPath.get(payload, `response.data.errors`, []) }
        }
      });
    },

    /**
     * Remove.
     */

    [actionTypes.REMOVE_PENDING](state, { meta: { resource } }) {
      return update(state, {
        [resource]: {
          isRemoving: { $set: true }
        }
      });
    },

    [actionTypes.REMOVE_FULFILLED](
      state,
      {
        payload: {
          data: {
            data: { deleted_rows }
          }
        },
        meta: { resource }
      }
    ) {
      return update(state, {
        [resource]: {
          records: {
            $apply: (records) =>
              records.filter((r) => !deleted_rows.includes(r.id))
          },
          isRemoving: { $set: false }
        }
      });
    },

    [actionTypes.REMOVE_REJECTED](state, { meta: { resource } }) {
      return update(state, {
        [resource]: {
          isRemoving: { $set: false }
        }
      });
    },

    /**
     * Clone.
     */

    [actionTypes.CLONE_PENDING](state, { meta: { resource, ids } }) {
      return update(state, {
        [resource]: {
          cloningRecords: { $set: ids },
          isCloning: { $set: true },
          errors: { $set: {} }
        }
      });
    },

    [actionTypes.CLONE_FULFILLED](
      state,
      { payload: { data }, meta: { resource } }
    ) {
      return update(state, {
        [resource]: {
          cloningRecords: { $set: [] },
          isCloning: { $set: false },
          clonedRecords: { $set: data.data },
          records: {
            $apply: (records) => [...data.data, ...records]
          }
        }
      });
    },

    [actionTypes.CLONE_REJECTED](state, { meta: { resource } }) {
      return update(state, {
        [resource]: {
          cloningRecords: { $set: [] },
          isCloning: { $set: false },
          errors: { $set: {} }
        }
      });
    }
  }
);

/**
 * Action Creators.
 */

export const registerResource = (resource) => (dispatch, getState) => {
  const state = getState();
  if (state.resources.hasOwnProperty(resource)) {
    return;
  }

  return dispatch({
    type: actionTypes.REGISTER_RESOURCE,
    payload: { resource }
  });
};

export const fetch = (config, params) => (dispatch) =>
  dispatch({
    type: actionTypes.FETCH_LIST,
    payload: config.api(params),
    meta: {
      resource: config.resource
    }
  });

export const details = (config, id, params) => ({
  type: actionTypes.DETAILS,
  payload: config.api(id, params),
  meta: {
    resource: config.resource,
    id
  }
});

export const create = (config, data, params) => (dispatch) =>
  dispatch({
    type: actionTypes.CREATE,
    payload: config.api(data, params),
    meta: {
      resource: config.resource
    }
  });

export const updateRecord = (config, id, data, params) => (dispatch) =>
  dispatch({
    type: actionTypes.UPDATE,
    payload: config.api(id, data, params),
    meta: {
      resource: config.resource,
      id
    }
  });

export const remove = (config, ids, params) => (dispatch) =>
  dispatch({
    type: actionTypes.REMOVE,
    payload: config.api(ids, params),
    meta: {
      resource: config.resource,
      ids
    }
  });

export const clone = (config, ids, params) => (dispatch) =>
  dispatch({
    type: actionTypes.CLONE,
    payload: config.api(ids, params),
    meta: {
      resource: config.resource,
      ids
    }
  });

export const setRecords = (config, records) => (dispatch, getState) =>
  dispatch({
    type: actionTypes.UPDATE_RECORDS,
    payload: {
      records: resolve(records, getRecords(getState(), config.resource))
    },
    meta: {
      resource: config.resource
    }
  });

export const updateDetails = (config, id, data) => (dispatch, getState) =>
  dispatch({
    type: actionTypes.UPDATE_DETAILS,
    payload: resolve(data, getDetailedRecord(getState(), config.resource, id)),
    meta: {
      resource: config.resource,
      id
    }
  });

/**
 * Selectors.
 */

export const isLoading = (state, resource) =>
  objectPath.get(state.resources, `${resource}.isLoading`, false);

export const isLoadingDetails = (state, resource) =>
  objectPath.get(state.resources, `${resource}.isLoadingDetails`, false);

export const getRecords = (state, resource) =>
  objectPath.get(state.resources, `${resource}.records`, []);

export const getDetailedRecords = (state, resource) =>
  objectPath.get(state.resources, `${resource}.detailedRecords`, []);

export const getDetailedRecord = (state, resource, id) =>
  getDetailedRecords(state, resource)[id] || {};

export const getRemovingRecords = (state, resource) =>
  objectPath.get(state.resources, `${resource}.removingRecords`, []);

export const isRemoving = (state, resource) =>
  objectPath.get(state.resources, `${resource}.isRemoving`, false);

export const getRemovedRecord = (state, resource) =>
  objectPath.get(state.resources, `${resource}.removedRecord`, {});

export const getErrors = (state, resource) =>
  objectPath.get(state.resources, `${resource}.errors`, {});

export const getPagination = (state, resource) =>
  objectPath.get(state.resources, `${resource}.pagination`, {
    current_page: 1,
    per_page: 10,
    total: 0
  });

export const isUpdating = (state, resource) =>
  objectPath.get(state.resources, `${resource}.isUpdating`, false);

export const isCreating = (state, resource) =>
  objectPath.get(state.resources, `${resource}.isCreating`, false);

export const getSavingRecords = (state, resource) =>
  objectPath.get(state.resources, `${resource}.savingRecords`, []);

export const getSavingRecord = (state, resource) =>
  objectPath.get(state.resources, `${resource}.savingRecord`, {});

export const isCloning = (state, resource) =>
  objectPath.get(state.resources, `${resource}.isCloning`, false);

export const getCloningRecords = (state, resource) =>
  objectPath.get(state.resources, `${resource}.cloningRecords`, []);

export const getClonedRecords = (state, resource) =>
  objectPath.get(state.resources, `${resource}.clonedRecords`, []);
