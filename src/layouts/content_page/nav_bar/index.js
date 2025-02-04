import { AppBar, Container, Toolbar } from "@mui/material";

import MDButton from "components/MDButton";
import MDBox from "components/MDBox";

import e20logo from "assets/images/e20/eighty_20_logo.png";
import rgba from "assets/theme/functions/rgba";

import useAuth from "hooks/useAuth";
import useAxiosPrivate from "hooks/useAxiosPrivate";
import { useMaterialUIController } from "context";
import { useEffect } from "react";
import PropTypes from "prop-types";
import { fontSize } from "@mui/system";
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';

function NavBar({color, position}) {
    const axiosPrivate  = useAxiosPrivate();
    
    const pages = ['home', 'schedule', 'careers'];
    const { isAuth, setIsAuth } = useAuth();
    const [controller] = useMaterialUIController();
    const { darkMode } = controller;

    console.log(isAuth);

    const handleLogout = async (e) => {
        e.preventDefault();
    
        try{
            await axiosPrivate.post('entity/logout', {
                refresh: localStorage.getItem('refreshToken')
            });

            setIsAuth(false);
        } catch(e) {
            
        }
    }

    // useEffect(() => {
    //     console.log('debug content navbar darkmode:', darkMode)
    // }, [])
    
    return (
        <AppBar position={position}>
            <Container maxWidth='xl'>
            <Toolbar disableGutters>
                <MDBox component="img" src={e20logo} width="20%" />
                <MDBox sx={{display: { xs: 'none', md: 'flex' } }}>
                {pages.map((page) => (
                    <MDButton
                    variant="text"
                    href={"/"+page}
                    key={page}
                    color = {color ? color : darkMode ? 'white' : 'primary'}
                    sx={{ 
                        my: 2, 
                        display: 'block', 
                        bgcolor: rgba(0,0,0,0.5),
                        borderRadius: 0,
                        fontSize: 16
                    }}
                    >
                    {page}
                    </MDButton>
                ))}
                </MDBox>
                { isAuth ? 
                <MDBox display="flex" sx={{ flexGrow: 1, flexDirection: 'row-reverse' }}>
                <MDButton 
                  color="info" 
                  onClick={handleLogout}
                  startIcon={<LogoutIcon fontSize="small" />}
                >
                  Log out
                </MDButton>
                </MDBox>
                : 
                <MDBox display="flex" sx={{ flexGrow: 1, flexDirection: 'row-reverse',  }}>
                    <MDButton 
                      color="info" 
                      variant="contained" 
                      href="/authentication/sign-in" 
                      startIcon={<LoginIcon fontSize="small" />}
                    >
                      Log in
                    </MDButton>
                </MDBox> }
                

            </Toolbar>
            </Container>
        </AppBar>
    );
}

NavBar.defaultProps = {
    position: 'absolute'
    
}

NavBar.propTypes = {
    color: PropTypes.string,
    position: PropTypes.string,
};

export default NavBar;