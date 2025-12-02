import axios from 'axios'

// Use relative URL to work with Vite proxy, or absolute URL if VITE_API_URL is set
// const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
})

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url, config.data || config.params)
    return config
  },
  (error) => {
    console.error('API Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data)
    return response
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export const getAppointments = () => {
  return api.get('/appointments')
}

export const getAvailableSlots = (date) => {
  return api.get('/appointments/available', {
    params: { date }
  })
}

export const createAppointment = (appointmentData) => {
  // Ensure date is in correct format
  const formattedData = {
    ...appointmentData,
    date: typeof appointmentData.date === 'string' 
      ? appointmentData.date 
      : appointmentData.date.toISOString().split('T')[0]
  }
  console.log('Creating appointment with data:', formattedData)
  return api.post('/appointments', formattedData)
}

export const cancelAppointment = (id) => {
  return api.delete(`/appointments/${id}`)
}

export default api

