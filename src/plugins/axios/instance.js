import axios from 'axios'

const instance = axios.create({
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    Accept: 'application/json',
  },
  timeout: 20000,
})

instance.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem(
      `${import.meta.env.VITE_CLIENT_ID}-token`,
    )

    return {
      ...config,
      headers: {
        ...config.headers,
        Authorization: token ? `Bearer ${token}` : '',
      },
    }
  },
  (error) => Promise.reject(error),
)

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.log('尚未登入')
          break
        case 404:
          console.log('頁面不存在')
          break
        case 500:
          console.log('伺服器錯誤')
          break
        default:
          console.log(error.message)
      }
    }
  },
)

export default instance
