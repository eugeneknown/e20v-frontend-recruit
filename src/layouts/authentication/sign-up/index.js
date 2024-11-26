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

// react-router-dom components
import { Link } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import bgImage from "assets/images/bg-sign-up-cover.jpeg";

import axios from "api/axios";
import { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { breadcrumbsClasses, Grid, Icon, IconButton, StepContent, TextField } from "@mui/material";

import { dataService } from "global/function";

import { useSnackbar } from "notistack";


function Cover() {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm_password, setConfirmPassword] = useState('');
    const [visiblePass, setVisiblePass] = useState(false)
    const [visibleConfPass, setVisibleConfPass] = useState(false)
    const [errMsg, setErrMsg] = useState('');

    // snackbar nostick
    const { enqueueSnackbar } = useSnackbar()

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const handleSubmit = async (e) => {
        e.preventDefault()

        // data validation
        if (!username.length) {
            enqueueSnackbar(`Username field is blank`, {
                variant: 'error',
                anchorOrigin: {
                    horizontal: 'right',
                    vertical: 'top',
                }
            })
            return

        } else if (!password.length) {
            enqueueSnackbar(`Password field is blank`, {
                variant: 'error',
                anchorOrigin: {
                    horizontal: 'right',
                    vertical: 'top',
                }
            })
            return

        } else if (!confirm_password.length) {
            enqueueSnackbar(`Confirm Password is blank`, {
                variant: 'error',
                anchorOrigin: {
                    horizontal: 'right',
                    vertical: 'top',
                }
            })
            return

        }

        dataService('POST', 'entity/register',{
            username: username,
            email: email,
            password: password,
            confirm_password: confirm_password,
        }).then((result) => {
            console.log('debug entity register response', result)
            enqueueSnackbar('User successfully created', {
                variant: 'success',
                preventDuplicate: true,
                anchorOrigin: {
                    horizontal: 'right',
                    vertical: 'top',
                }
            })

            navigate(from, { replace: true });
        }, (err) => {
            console.log('debug entity register error response', err)
            var err = err.response.data

            console.log(typeof err);
            if (typeof err === 'object') {
                if ('password' in err) {
                    Object.keys(err.password).map((item, index) => {
                        enqueueSnackbar(err.password[item], {
                            variant: 'error',
                            preventDuplicate: true,
                            anchorOrigin: {
                                horizontal: 'right',
                                vertical: 'top',
                            }
                        })
                    })
    
                } else if ('Authentication' in err) {
                    enqueueSnackbar(err.Authentication[0], {
                        variant: 'error',
                        preventDuplicate: true,
                        anchorOrigin: {
                            horizontal: 'right',
                            vertical: 'top',
                        }
                    })
                }

            } else {
                enqueueSnackbar(`Username is already exists`, {
                    variant: 'error',
                    preventDuplicate: true,
                    anchorOrigin: {
                        horizontal: 'right',
                        vertical: 'top',
                    }
                })
            }

        })

    }

    const credentialsHandle = (object) => {
        setCredentials( cred => ({ ...cred, ...object }) );
        console.log("debug signup credentials handle:", credentials);
    }

    return (
        <CoverLayout image={bgImage}>
            <Card>
                <MDBox
                    variant="gradient"
                    bgColor="info"
                    borderRadius="lg"
                    coloredShadow="success"
                    mx={2}
                    mt={-3}
                    p={3}
                    mb={1}
                    textAlign="center"
                >
                    <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
                    Join us today
                    </MDTypography>
                    <MDTypography display="block" variant="button" color="white" my={1}>
                    Enter your username and password to register
                    </MDTypography>
                </MDBox>
                <MDBox pt={4} pb={3} px={3}>
                    <MDBox component="form" role="form">
                        <MDBox mb={2}>
                        <TextField 
                            onChange={(e) => setUsername(e.target.value)} 
                            value={username} 
                            type="text" 
                            label="Username" 
                            variant="standard" 
                            fullWidth autoComplete="off" 
                        />
                        </MDBox>
                        <MDBox mb={2}>
                        <TextField 
                            onChange={(e) => setEmail(e.target.value)} 
                            value={email} 
                            type="text" 
                            label="Email" 
                            variant="standard" 
                            fullWidth autoComplete="off" 
                        />
                        </MDBox>
                        <MDBox mb={2}>
                        <TextField 
                            onChange={(e) => setPassword(e.target.value)} 
                            value={password} 
                            type={visiblePass ? 'text' : "password"}
                            label="Password" 
                            variant="standard" 
                            fullWidth 
                            InputProps={{
                                endAdornment: <IconButton size="small" onClick={e => setVisiblePass(!visiblePass)}><Icon>{visiblePass ? 'visibility' : 'visibility_off'}</Icon></IconButton>,
                                autoComplete: 'new-password'
                            }}
                        />
                        </MDBox>
                        <MDBox mb={2}>
                        <TextField 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            value={confirm_password} 
                            type={visibleConfPass ? 'text' : "password"}
                            label="Confirm Password" 
                            variant="standard" 
                            fullWidth 
                            InputProps={{
                                endAdornment: <IconButton size="small" onClick={e => setVisibleConfPass(!visibleConfPass)}><Icon>{visibleConfPass ? 'visibility' : 'visibility_off'}</Icon></IconButton>,
                            }}
                        />
                        </MDBox>
                        <MDBox display="flex" alignItems="center" ml={-1}>
                            <Checkbox required />
                            <MDTypography
                                variant="button"
                                fontWeight="regular"
                                color="text"
                                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
                            >
                                &nbsp;&nbsp;I agree the&nbsp;
                            </MDTypography>
                            <MDTypography
                                component="a"
                                href="#"
                                variant="button"
                                fontWeight="bold"
                                color="info"
                                textGradient
                            >
                                Terms and Conditions
                            </MDTypography>
                        </MDBox>
                        <MDBox mt={4} mb={1}>
                            <MDButton onClick={handleSubmit} variant="gradient" color="info" fullWidth>
                                sign up
                            </MDButton>
                        </MDBox>
                        <MDBox mt={3} mb={1} textAlign="center">
                            <MDTypography variant="button" color="text">
                                Already have an account?{" "}
                                <MDTypography
                                component={Link}
                                to="/authentication/sign-in"
                                variant="button"
                                color="info"
                                fontWeight="medium"
                                textGradient
                                >
                                Sign In
                                </MDTypography>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </MDBox>
            </Card>
        </CoverLayout>
    );
}

export default Cover;