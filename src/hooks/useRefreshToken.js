import axios from '../api/axios';
import useAuth from './useAuth';

import { jwtDecode } from "jwt-decode";

const useRefreshToken = () => {
    const { auth, setAuth, setIsAuth } = useAuth();
    
    const refresh = async () => {
        const response = await axios.post('entity/refresh', {
            refresh: localStorage.getItem('refreshToken'),
        });
        const accessToken = response?.data?.access;
        const data = jwtDecode(accessToken);

        // TODO data must be fetch at the cache
        console.log('refresh token', data);
        const is_admin = data['is_superuser'] || data['is_staff'];
        setAuth(prev => {
            return { 
                ...prev, 
                accessToken: accessToken,
                is_admin: is_admin,
                id: typeof data['entity_id'] != 'undefined' ? data['entity_id'] : data['id'][0]
            }
        });
        setIsAuth(true);
        // temporarily set the refresh token in local storage
        // TODO for storing refresh token, redis would be helpful
        // setAuth({ refreshToken: response.data.refresh })
        localStorage.setItem('refreshToken', response.data.refresh);
        return accessToken;
    }
    return refresh;
};

export default useRefreshToken;