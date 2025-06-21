import axios, { AxiosInstance } from 'axios';

// Create a custom Axios instance with typed configuration
const ngrokAxiosInstance: AxiosInstance = axios.create({
  baseURL: 'https://67bc-110-235-236-208.ngrok-free.app',
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

export default ngrokAxiosInstance;