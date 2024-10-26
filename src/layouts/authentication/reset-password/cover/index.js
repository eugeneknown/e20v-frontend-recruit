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

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import bgImage from "assets/images/bg-reset-cover.jpeg";
import { useEffect, useRef, useState } from "react";
import { dataService } from "global/function";

import { useSnackbar } from "notistack";
import { Link } from "react-router-dom";
import { formatDateTime } from "global/function";
import moment from "moment";

function Cover() {

  var resetTimer = 60000
  const [email, setEmail] = useState('')
  const [reset, setReset] = useState(true)
  const [time, setTime] = useState(resetTimer) //60000
  const timer = useRef()

  // snackbar nostick
  const { enqueueSnackbar } = useSnackbar()

  const handleSubmit = () => {
    setReset(false)
    startTimer()

    if (!email.length) {
      enqueueSnackbar(`Email field is blank`, {
          variant: 'error',
          anchorOrigin: {
              horizontal: 'right',
              vertical: 'top',
          }
      })
      return

    }
    if (!email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )) {
      enqueueSnackbar(`Invalid Email format`, {
        variant: 'error',
        anchorOrigin: {
            horizontal: 'right',
            vertical: 'top',
        }
      })
      return

    }

    dataService('POST', 'entity/password_reset/', {email}).then((result) => {
      console.log('debug entity reset password response', result)
      enqueueSnackbar(`Password reset link has been sent to your email. Please check`, {
        variant: 'success',
        anchorOrigin: {
            horizontal: 'right',
            vertical: 'top',
        }
      })

    }).catch((err) => {
      console.log('debug entity reset password error response', err)
      enqueueSnackbar(err.response.data.email[0], {
        variant: 'error',
        anchorOrigin: {
            horizontal: 'right',
            vertical: 'top',
        }
      })
    })
  }

  const startTimer = () => {
    timer.current = setInterval(() => {
      console.log('time', time);
      setTime(prev => prev - 1000)
    }, 1000)
  }

  useEffect(() => {
    if (time <= 0) {
      clearInterval(timer.current)
      setReset(true)
      setTime(resetTimer)
    }
  },[time])

  return (
    <CoverLayout coverHeight="50vh" image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          py={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h3" fontWeight="medium" color="white" mt={1}>
            Reset Password
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            You will receive an e-mail in maximum 60 seconds
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={4}>
              <MDInput type="email" label="Email" variant="standard" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} />
            </MDBox>
            <MDBox mt={6} mb={1}>
              <MDButton variant="gradient" color="info" disabled={reset==false} fullWidth onClick={handleSubmit}>
                {reset ? 'Reset' : 'Re-send'}
              </MDButton>
              <MDTypography variant="button" color="text">
                You can Re-send it again in &nbsp;{formatDateTime(moment(time), 'mm:ss')}
              </MDTypography>
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
