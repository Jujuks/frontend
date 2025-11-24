import { mockApi } from '../mocks/apiMocks';

const api = {
  get: (url) => mockApi.get(url),
  post: (url, data) => mockApi.post(url, data),
  put: (url, data) => mockApi.put(url, data),
  delete: (url) => mockApi.delete(url),
};

export default api;