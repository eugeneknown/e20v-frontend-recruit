import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from '../../hooks/useRefreshToken';
import useAuth from '../../hooks/useAuth'
import MDBox from "components/MDBox";
import { CircularProgress } from "@mui/material";

const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const { auth, persist } = useAuth();

    useEffect(() => {
        let isMounted = true;
        const verifyRefreshToken = async () => {
            try {
                if (localStorage.getItem('refreshToken')) await refresh();
            }
            catch (err) {
                console.log('debug PersistLogin:', err);
            }
            finally {
                isMounted && setIsLoading(false);
            }
        }

        // persist added here AFTER tutorial video
        // Avoids unwanted call to verifyRefreshToken
        !auth?.accessToken && persist ? verifyRefreshToken() : setIsLoading(false);

        return () => isMounted = false;
    }, [])

    useEffect(() => {
        // console.log(`isLoading: ${isLoading}`)
        // console.log(`aT: ${JSON.stringify(auth?.accessToken)}`)
    }, [isLoading])

    const GradientProgress = () => (
        <MDBox sx={{ 
            // display: isLoading ? 'block' : 'none', 
            position: 'fixed',
            top: '50%',
            right: '50%',
            transform: 'translate(-50%, -50%)',
        }}>
          <svg width={0} height={0}>
            <defs>
              <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#e01cd5" />
                <stop offset="100%" stopColor="#1CB5E0" />
              </linearGradient>
            </defs>
          </svg>
          <CircularProgress sx={{ 'svg circle': { stroke: 'url(#my_gradient)' } }} />
        </MDBox>
    )

    return (
        <>
            {!persist
                ? <Outlet />
                : isLoading
                    ? <GradientProgress/>
                    : <Outlet />
            }
        </>
    )
}

export default PersistLogin