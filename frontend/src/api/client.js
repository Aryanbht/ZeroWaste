import axios from 'axios'

// In development, Vite proxys /api to localhost:8000
// In production, we use the Render backend URL
const isProd = import.meta.env.PROD
const baseURL = isProd 
  ? 'https://zerowaste-8dxa.onrender.com' // Production Render backend
  : '' // Local dev server (uses Vite proxy)

const client = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default client
