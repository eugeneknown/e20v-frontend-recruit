/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState, useRef, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

// react-router-dom components
import { Link, useNavigate, useLocation } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import googleIcon from "assets/images/icons/google.png"

import axios from "api/axios";
import useAuth from "hooks/useAuth";
import { useSnackbar } from "notistack";
import { Divider, Icon, IconButton } from "@mui/material";

import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";


function Basic() {
  const [rememberMe, setRememberMe] = useState(false);

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const { auth, setAuth, persist, setPersist, setIsAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const googleClientId = '739972801733-bb5obcrbpclmaiupbl2057re25uear8a.apps.googleusercontent.com'
  const googleCallbackUri = 'http://localhost:8000/api/entity/google/login/callback/'
  const googleSignInUrl = `https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=${googleCallbackUri}&prompt=consent&response_type=code&client_id=${googleClientId}&scope=openid%20email%20profile&access_type=offline`;

  const userRef = useRef('');
  const errRef = useRef('');

  const [ user, setUser ] = useState('');
  const [ pwd, setPwd ] = useState('');
  const [ visible, setVisible ] = useState(false);
  const [ errMsg, setErrMsg ] = useState('');

  // snackbar nostick
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    userRef.current.focus();
  }, [])

  useEffect(() => {
    setErrMsg('');
  }, [user, pwd])

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('entity/login',
        {
          username: user,
          password: pwd
        },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );
      const accessToken = response?.data?.access;
      const data = jwtDecode(accessToken);
      const refreshToken = response?.data?.refresh;
      const is_admin = data['is_superuser'] || data['is_staff'] ? true : false;
      console.log("debug access token:", data);
      setAuth({
        accessToken: accessToken,
        is_admin:  is_admin,
        id: data['entity_id']
      });
      setIsAuth(true);
      localStorage.setItem('refreshToken', refreshToken)
      setUser('');
      setPwd('');
      console.log('debug login', auth)
      navigate(is_admin ? '/dashboard' : from, { replace: true });
    } catch (err) {
      setErrMsg(err);
      console.log('debug err login:', err);
      enqueueSnackbar('Invalid Username or Password.', {
        variant: 'error',
        preventDuplicate: true,
        anchorOrigin: {
          horizontal: 'right',
          vertical: 'top',
        }
      })
      // errRef.current.focus();
    }
  }

  // const togglePersist = () => {
  //   setPersist(prev => !prev);
  // }

  useEffect(() => {
    localStorage.setItem("persist", true);
  })

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const authorizationCode = credentialResponse.code;

      // Send the authorization code to your Django backend
      const response = await axios.post(googleCallbackUri, {
        code: authorizationCode,
      });

      // Process the JWT tokens returned by the backend
      const { access, refresh, user } = response.data;

      console.log("Access Token:", access);
      console.log("User Info:", user);

      // Save tokens in localStorage or context (securely)
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);

      alert(`Welcome, ${user.name}!`);
    } catch (error) {
      console.error("Google login failed:", error);
      alert("Google login failed. Please try again.");
    }
  };

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Sign in
          </MDTypography>
          <Grid container spacing={3} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <FacebookIcon color="inherit" />
              </MDTypography>
            </Grid>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <GitHubIcon color="inherit" />
              </MDTypography>
            </Grid>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <GoogleIcon color="inherit" />
              </MDTypography>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDInput 
                type="text" 
                label="Username" 
                fullWidth
                id="username"
                ref={userRef}
                autoComplete="off"
                onChange={(e) => setUser(e.target.value)}
                value={user}
                required
               />
            </MDBox>
            <MDBox mb={2}>
              <MDInput 
              type={visible ? 'text' : 'password'} 
              label="Password" 
              fullWidth 
              id="password"
              onChange={(e) => setPwd(e.target.value)}
              value={pwd}
              required
              InputProps={{
                endAdornment: <IconButton size="small" onClick={e => setVisible(!visible)}><Icon>{visible ? 'visibility' : 'visibility_off'}</Icon></IconButton>,
              }}
              />
            </MDBox>
            <MDBox display="flex" justifyContent="space-between" ml={-1}>
              <MDBox display="flex" alignItems="center">
                <Switch checked={rememberMe} onChange={handleSetRememberMe} />
                <MDTypography
                  variant="button"
                  fontWeight="regular"
                  color="text"
                  onClick={handleSetRememberMe}
                  sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
                >
                  &nbsp;&nbsp;Remember me
                </MDTypography>
              </MDBox>
              <MDBox textAlign="center">
                <MDTypography
                  component={Link}
                  to="/authentication/reset-password"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Forgot the password?
                </MDTypography>
              </MDBox>
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth onClick={handleSubmit}>
                sign in
              </MDButton>
            </MDBox>
            <Divider />
            {/*<MDButton 
              href={googleSignInUrl}
              target="_blank" 
              rel="noopener noreferrer"
              variant='outlined' 
              color="secondary" 
              startIcon={<MDBox component='img' src={googleIcon} 
              width='25px' />} 
              fullWidth 

            >
              Sign in with Google
            </MDButton>*/}
            <GoogleOAuthProvider clientId='739972801733-bb5obcrbpclmaiupbl2057re25uear8a.apps.googleusercontent.com'>
              <div style={{ marginTop: "50px", textAlign: "center" }}>
                <h2>Login with Google</h2>
                <GoogleLogin
                  onSuccess={handleGoogleLogin}
                  onError={() => {
                    console.log("Login Failed");
                  }}
                  useOneTap
                  flow="auth-code" // Use authorization code flow
                />
              </div>
            </GoogleOAuthProvider>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Don&apos;t have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-up"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign up
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
