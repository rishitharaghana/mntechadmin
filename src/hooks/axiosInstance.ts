import axios, { AxiosInstance } from 'axios';

// Create a custom Axios instance with typed configuration
const ngrokAxiosInstance: AxiosInstance = axios.create({
  baseURL: 'https://c758-110-235-236-210.ngrok-free.app',

  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

export default ngrokAxiosInstance;