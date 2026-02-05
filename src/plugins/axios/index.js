import req from './instance';

export default {
  async POST(url, params, config) {
    try {
      const res = await req.post(url, params, config);
      return res.data;
    } catch (res) {
      return Promise.reject(res.message);
    }
  },
  async GET(url, params, config) {
    try {
      const res = await req.get(url, params, config);
      return res.data;
    } catch (res) {
      return Promise.reject(res.message);
    }
  },
  async PUT(url, params, config) {
    try {
      const res = await req.put(url, params, config);
      return res.data;
    } catch (res) {
      return Promise.reject(res.message);
    }
  },
  async DELETE(url, params, config) {
    try {
      const res = await req.delete(url, params, config);
      return res.data;
    } catch (res) {
      return Promise.reject(res.message);
    }
  },
};
