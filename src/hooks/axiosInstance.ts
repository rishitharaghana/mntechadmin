import axios, { AxiosInstance } from 'axios';

const ngrokAxiosInstance: AxiosInstance = axios.create({
     baseURL: 'https://api.mntechs.com',
//  baseURL: 'http://localhost:4001',

 
  headers: { 
    'Content-Type': 'application/json'
  },  
});

export default ngrokAxiosInstance;