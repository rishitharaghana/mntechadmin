import axios, { AxiosInstance } from 'axios';

const ngrokAxiosInstance: AxiosInstance = axios.create({
  baseURL: 'https://api.mntechs.com',
  headers: { 
    'Content-Type': 'application/json',
  },
});

export default ngrokAxiosInstance;