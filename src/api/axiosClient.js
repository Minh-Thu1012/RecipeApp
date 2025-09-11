import axios from 'axios'

const API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1'

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosClient.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axiosClient.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config
    
    if (!originalRequest._retry && 
        (error.code === 'NETWORK_ERROR' || 
         error.code === 'ECONNABORTED' || 
         (error.response && error.response.status >= 500))) {
      
      originalRequest._retry = true
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      try {
        return await axiosClient(originalRequest)
      } catch (retryError) {
        console.error('Retry failed:', retryError)
        return Promise.reject(retryError)
      }
    }
    
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

export default axiosClient
