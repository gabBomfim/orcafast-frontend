import api from '../../api';

export default function createResourceApi(route, extra = {}) {
  return {
    fetch(params) {
      return api.get(route, { params });
    },

    details(id, params) {
      return api.get(`${route}/${id}`, { params });
    },

    create(data, params) {
      return api.post(route, data instanceof FormData ? data : { ...data }, {
        params
      });
    },

    update(id, data, params) {
      return api.put(
        `${route}/${id}`,
        data instanceof FormData ? data : { ...data },
        { params }
      );
    },

    remove(ids, params) {
      return api.post(`${route}/remove/mass`, { rows: ids, params });
    },

    clone(selectionData, params) {
      return api.post(`${route}/clone`, selectionData, { params });
    },

    ...extra
  };
}
