import axios, { AxiosInstance } from 'axios';

// Create a custom Axios instance with typed configuration
const ngrokAxiosInstance: AxiosInstance = axios.create({
  baseURL: 'https://fd3c-2409-40f0-119a-8401-5c1f-a1bc-5a11-de0a.ngrok-free.app',
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

export default ngrokAxiosInstance;