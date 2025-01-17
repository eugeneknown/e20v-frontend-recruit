import { isInternalTimeView } from '@mui/x-date-pickers/internals';
import axios from 'axios';
const BASE_URL = 'http://localhost:8000/api/';
// const BASE_URL = 'http://192.168.254.134:8000/api/'; // mikrotic
// const BASE_URL = 'http://192.168.113.147:8000/api/'; // mikrotic 5G 
// const BASE_URL = 'http://192.168.254.112:8000/api/'; //globe
// const BASE_URL = 'https://e20v-backend.onrender.com/api/';

export default axios.create({
    baseURL: BASE_URL
});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});