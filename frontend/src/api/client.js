import axios from 'axios'

// In development, Vite proxys /api to localhost:8000
// In production, we use the Render backend URL
const isProd = import.meta.env.PROD
const baseURL = isProd 
  ? 'https://your-backend-name.onrender.com' // Replace after Render deployment
  : '' // Empty string uses the current host (works with Vite proxy)

const client = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default client
