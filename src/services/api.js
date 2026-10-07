import axios from 'axios'

// API REST simulada: archivos JSON en /public/api (funcionan igual en desarrollo y en GitHub Pages)
export const BASE_URL = process.env.BASE_URL || '/'

export const api = axios.create({
  baseURL: `${BASE_URL}api/`,
  timeout: 10000
})
