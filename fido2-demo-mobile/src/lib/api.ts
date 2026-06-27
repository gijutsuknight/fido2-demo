import axios, { type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { config } from '@/config'
import { useAuthStore } from './store'

const api = axios.create({ baseURL: `${config.api.baseUrl}/api` })

function getFullUrl(config: InternalAxiosRequestConfig) {
  return axios.getUri(config)
}

function getHeaders(
  headers: InternalAxiosRequestConfig['headers'] | AxiosResponse['headers']
) {
  if (!headers) return {}
  if (typeof headers.toJSON === 'function') return headers.toJSON()
  return headers
}

function logRequest(config: InternalAxiosRequestConfig) {
  console.log('[REQUEST]', getFullUrl(config), getHeaders(config.headers), config.data ?? null)
}

function logResponse(response: AxiosResponse) {
  console.log(
    '[RESPONSE]',
    getFullUrl(response.config),
    getHeaders(response.headers),
    response.data ?? null
  )
}

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  logRequest(config)
  return config
})

api.interceptors.response.use(
  (res) => {
    logResponse(res)
    return res
  },
  (err) => {
    if (err.response) logResponse(err.response)
    if (err.response?.status === 401) {
      useAuthStore.getState().logout()
    }
    return Promise.reject(err)
  }
)

export default api
