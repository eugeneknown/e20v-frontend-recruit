import {Card, CardContent, Chip, Container, Divider, Icon, IconButton, Link, Step, StepLabel, Stepper, TextField} from "@mui/material";
import Grid from "@mui/material/Grid2";

import PageLayout from "examples/LayoutContainers/PageLayout";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import useAuth from "hooks/useAuth";
import { useEffect, useState } from "react";
import { dataServicePrivate, formatDateTime } from "global/function";
import NavBar from "layouts/content_page/nav_bar";

import MDButton from "components/MDButton";

import { useLocation, useNavigate } from "react-router-dom";
import MDInput from "components/MDInput";

import * as yup from 'yup';
import { Field, FieldArray, Form, Formik, useFormik } from 'formik';
import { generateObjectSchema } from "global/validation";
import { generateYupSchema } from "global/validation";
import { generateFormInput } from "global/form";
import Footer from "examples/Footer";
import SwipeableViews from "react-swipeable-views";
import CareersStepper from "../careers-stepper";

import e20logo from 'assets/images/e20/Eighty_20_shadow_2_transparent.png'
import smiley1 from 'assets/images/icons/smiley icon1.png'


function CareerSubmitted(){

    // local
    const local = localStorage.getItem('answers')
    const removeLocalData = () => {
        localStorage.removeItem('answers')
    }

    // navigation
    const navigate = useNavigate();
    const location = useLocation(); 
    const from = location.state?.from?.pathname || "/careers/personalinfo";
    const prevPage = () => navigate(from, { replace: true })
    const toPage = (url, params={}) => navigate(url, { state: { from: location, ...params }, replace: true })

    const {isAuth, auth} = useAuth();
    const [answers, setAnswers] = useState(local ? JSON.parse(local) : {})
    const [questions, setQuestions] = useState()
    const [step, setStep] = useState(0)

    // must be revice
    const careerId = localStorage.getItem('career_id')
    console.log('career id', careerId);

    const validationSchema = (data) => {
        // init validation
        var yupObject = generateObjectSchema(data)
        var yupSchema = yupObject.reduce(generateYupSchema, {})
        return yup.object().shape(yupSchema)
    }

    useEffect(() => {
        var entity_id = auth['id']

        // fetch career
        dataServicePrivate('POST', 'hr/careers/all', {
            filter: [{
                operator: '=',
                target: 'id',
                value: careerId,
            }],
            relations: ['has', 'questions'],
        }).then((result) => {
            console.log('debug careers result', result);
            result = result.data['careers'][0].has
            generateQuestionsSchema(result)

        }).catch((err) => {
            console.log('debug careers error result', err);

        })

    }, [])

    useEffect(() => {
        if (answers) {
            const onbeforeunloadFn = () => {
                localStorage.setItem('answers', JSON.stringify(answers))
            }
          
            window.addEventListener('beforeunload', onbeforeunloadFn);
            return () => {
                window.removeEventListener('beforeunload', onbeforeunloadFn);
            }
        }
    },[answers])

    return (
        <PageLayout>
            <NavBar position='absolute' />
            <MDBox mt={5} maxWidth="sm" mx='auto' pt={6} pb={3} display='flex' justifyContent='center'>
                <MDBox component='img' src={e20logo}
                sx={{
                    position: 'absolute',
                    margin: 'auto',
                    width: '50%',
                    opacity: '.1',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                }}
                />
                <Card sx={{ bgcolor: 'transparent' }}>
                    <CardContent>
                        <MDBox>
                            <MDBox 
                                sx={{ 
                                    mx: 2, p: 5
                                }}
                            >
                                <MDTypography variant='h2' sx={{
                                    mb: 3,
                                    fontSize: '1.5rem',
                                    fontWeight: 'normal',
                                    textAlign: 'center',
                                }}>Thank you for filling out the form! <MDBox sx={{
                                    position: 'relative',
                                    display: 'inline-block',
                                    width: 'inherit',
                                    height: 'inherit',
                                    p: '10px',
                                }}><MDBox component='img' src={smiley1} sx={{
                                    display: 'block',
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    minHeight: '100%',
                                    minWidth: '100%',
                                    transform: 'translate(-50%, -50%)',
                                    height: '33px',
                                }} /></MDBox></MDTypography>
                                <MDBox>
                                    <MDTypography vairant='body1' gutterBottom sx={{ fontSize: '17px', fontWeight: 'lighter' }}>
                                        We have received your application and will get back to you soon.
                                        Meanwhile you can follow us on <Link color='primary' href="https://www.facebook.com/eighty20virtualcareers">Facebook</Link> for updates.
                                    </MDTypography>
                                    <MDTypography vairant='body1' gutterBottom sx={{ fontSize: '17px', fontWeight: 'lighter' }}>
                                        For any further inquiries, please contact <Link color='primary' href="#">careers@eighty20virtual.com</Link> 
                                    </MDTypography>
                                    <MDBox display='flex' justifyContent="space-between">
                                        <Link 
                                        color='info' 
                                        // href={`/careers/response?entity=${entityCareer.entity_id}&careers=${entityCareer.careers_id}`} 
                                        sx={{ my: 'auto' }} 
                                        target='_blank'
                                        variant="text"
                                        >
                                            <MDButton variant='text' sx={{ pl: 0 }} color='info'>View Response</MDButton>
                                        </Link>
                                        <MDButton color='info'>Return to page</MDButton>
                                    </MDBox>
                                </MDBox>
                            </MDBox>
                        </MDBox>
                    </CardContent>
                </Card>
            </MDBox>
            <Footer />
        </PageLayout>
    );
}

export default CareerSubmitted;