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
import { Link, useSearchParams } from "react-router-dom";

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

    const [password, setPassword] = useState('');
    const [confirm_password, setConfirmPassword] = useState('');
    const [visiblePass, setVisiblePass] = useState(false)
    const [visibleConfPass, setVisibleConfPass] = useState(false)
    const [params, setParams] = useSearchParams('');

    // snackbar nostick
    const { enqueueSnackbar } = useSnackbar()

    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (e) => {
        e.preventDefault()

        // data validation
        if (!password.length) {
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

        if ( password != confirm_password ) {
            enqueueSnackbar(`Confirm Password is different from Password`, {
                variant: 'error',
                anchorOrigin: {
                    horizontal: 'right',
                    vertical: 'top',
                }
            })
            return
        }

        dataService('POST', 'entity/password_reset/confirm/',{
            password,
            token: params.get('token'),
        }).then((result) => {
            console.log('debug entity change password response', result)
            enqueueSnackbar('User password successfully change', {
                variant: 'success',
                preventDuplicate: true,
                anchorOrigin: {
                    horizontal: 'right',
                    vertical: 'top',
                }
            })

            navigate('authentication/sign-in', { replace: true });
        }, (err) => {
            console.log('debug entity change password error response', err)
            var err = err.response.data

            if ('detail' in err) {
                enqueueSnackbar(`Token is expired`, {
                    variant: 'error',
                    anchorOrigin: {
                        horizontal: 'right',
                        vertical: 'top',
                    }
                })
            }
            else if ('password' in err) {
                Object.keys(err.password).map((item, index) => {
                    enqueueSnackbar(err.password[item], {
                        variant: 'error',
                        anchorOrigin: {
                            horizontal: 'right',
                            vertical: 'top',
                        }
                    })  
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
                    Password Reset
                    </MDTypography>
                    <MDTypography display="block" variant="button" color="white" my={1}>
                    Enter your new password
                    </MDTypography>
                </MDBox>
                <MDBox pt={4} pb={3} px={3}>
                    <MDBox component="form" role="form">
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
                        <MDBox mt={4} mb={1}>
                            <MDButton onClick={handleSubmit} variant="gradient" color="info" fullWidth>
                                change password
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