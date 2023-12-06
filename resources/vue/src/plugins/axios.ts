import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:8000/'

const api = axios.create({
  baseURL: 'http://localhost:8000/api/'
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) { config.headers.Authorization = `Bearer ${JSON.parse(token)}` }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
      window.location.reload()
    }
    return Promise.reject(error)
  }
)

export {
  api,
  axios
}
