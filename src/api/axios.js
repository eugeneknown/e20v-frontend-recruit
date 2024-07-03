import { isInternalTimeView } from '@mui/x-date-pickers/internals';
import axios from 'axios';
const BASE_URL = 'http://localhost:8000/api/';
// const BASE_URL = 'http://192.168.88.189:8000/api/';

export default axios.create({
    baseURL: BASE_URL
});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});