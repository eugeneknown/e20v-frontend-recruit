import {Card, CardContent, Chip, Container, Divider, Icon, IconButton, Link, TextField} from "@mui/material";
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
import CareersStepper from "../../careers-stepper";

import * as yup from 'yup';
import { Field, FieldArray, Form, Formik, useFormik } from 'formik';
import { generateObjectSchema } from "global/validation";
import { generateYupSchema } from "global/validation";
import { generateFormInput } from "global/form";
import Footer from "examples/Footer";
import workExperienceData from "./work-experienceData";


function WorkExperienceForm(){

    // navigation
    const navigate = useNavigate();
    const location = useLocation(); 
    const from = location.state?.from?.pathname || "/careers/personalinfo";
    const prevPage = () => navigate(from, { replace: true })
    const toPage = (url, params={}) => navigate(url, { state: { from: location, ...params }, replace: true })

    const {isAuth, auth} = useAuth();
    const [experience, setExperience] = useState()
    const [details, setDetails] = useState()

    // remove personal local data
    localStorage.removeItem('experience')

    const local = localStorage.getItem('work_experience')
    const removeLocal = () => {
        localStorage.removeItem('work_experience')
    }

    // init validation
    var yupObject = generateObjectSchema(workExperienceData)
    var yupSchema = yupObject.reduce(generateYupSchema, {})
    var validationSchema = yup.object().shape(yupSchema)

    useEffect(() => {
        handleInit()
    }, [])

    const handleInit = () => {
        var entity_id = auth['id']

        // fetch experience
        dataServicePrivate('POST', 'entity/experience/all', {
            filter: [{
                operator: '=',
                target: 'entity_id',
                value: entity_id,
            }],
            relations: ['details'],
        }).then((result) => {
            console.log('debug experience result', result);
            result = result.data['experience'][0]
            if (local) {
                result = JSON.parse(local)
            } else {
                localStorage.setItem('work_experience', JSON.stringify(result))
            }
            setExperience(result)
            setDetails(result['details'])

        }).catch((err) => {
            console.log('debug experience error result', err);

        })
    }

    useEffect(() => {
        if (experience) {
            const onbeforeunloadFn = () => {
                localStorage.setItem('work_experience', JSON.stringify(experience))
            }
          
            window.addEventListener('beforeunload', onbeforeunloadFn);
            return () => {
                window.removeEventListener('beforeunload', onbeforeunloadFn);
            }
        }
    },[experience])

    const handleSubmit = (data) => {
        dataServicePrivate('POST', 'entity/experience/define', data).then((result) => {
            console.log('debug experience define result', result);
            removeLocal()
            navigate('/careers/personalinfo', { replace: true })
        }).catch((err) => {
            console.log('debug experience define error result', err);

        })
    }

    const handleDelete = (id) => {
        dataServicePrivate('POST', 'entity/experience/details/delete', id).then((result) => {
            console.log('debug experience details delete result', result);
            removeLocal()
            handleInit()
        }).catch((err) => {
            console.log('debug experience details delete error result', err);

        })
    }

    return (
        <PageLayout>
            <NavBar position='absolute' />
            <MDBox mt={5} maxWidth="sm" mx='auto' pt={6} pb={3}>
                <Card variant="outlined">
                    <CardContent>
                        <IconButton onClick={prevPage}><Icon>keyboard_backspace</Icon></IconButton>
                        <MDTypography sx={{ mt: 3 }} variant='h3'>Work Experience</MDTypography>
                        <Divider />
                        {details && Object.keys(details).map((item, index) => (
                            <Card position='relative' sx={{ my: 2 }}>
                                <MDBox display='flex' position='absolute' right={0} p={1}>
                                    <IconButton onClick={() => toPage('/careers/personalinfo/experienceform', { id: details[item].id })}><Icon>edit</Icon></IconButton>
                                    <IconButton onClick={() => handleDelete(details[item].id)}><Icon>delete</Icon></IconButton>
                                </MDBox>
                                <CardContent>
                                    <MDTypography variant='h6'>{details[item].position_held}</MDTypography>
                                    <MDTypography variant='body2' sx={{ textTransform: 'capitalize' }}>{details[item].company}</MDTypography>
                                    <MDTypography variant='body2' sx={{ textTransform: 'capitalize' }}>{details[item].department}</MDTypography>
                                    <MDTypography variant='body2'>
                                        {formatDateTime(details[item].start_date, 'MMMM YYYY')} to {details[item].present ? `Present` : formatDateTime(details[item].end_date, 'MMMM YYYY')}
                                    </MDTypography>
                                    <MDTypography variant='body2' sx={{ textTransform: 'capitalize' }}>{details[item].stay_length}</MDTypography>
                                    <MDTypography variant='body2' sx={{ textTransform: 'capitalize' }}>{details[item].leave_reason}</MDTypography>
                                </CardContent>
                            </Card>
                        ))}
                        <MDButton
                            variant='outlined' 
                            color='secondary' 
                            fullWidth
                            startIcon={<Icon>add</Icon>}
                            onClick={() => toPage('/careers/personalinfo/experienceform')}
                        >
                            <MDTypography variant='body2' color='secondary'>Add Work Experience</MDTypography>
                        </MDButton>
                        <Divider />
                        {experience && <Formik
                            initialValues={experience}
                            validationSchema={validationSchema}
                            onSubmit={(data) => {
                                handleSubmit(data)
                            }}
                        >
                            {({values, touched, errors, handleChange, handleBlur, setFieldValue}) => (
                                <Form>
                                    <FieldArray
                                        render={arrayHelper => (
                                        <MDBox>
                                            {setExperience(values)}
                                            {Object.keys(workExperienceData).map((item, index) => {
                                                return (generateFormInput({
                                                    variant: 'outlined',
                                                    fullWidth: true,
                                                    type: workExperienceData[item].type,
                                                    id: workExperienceData[item].id,
                                                    name: workExperienceData[item].id,
                                                    label: workExperienceData[item].label,
                                                    value: values[workExperienceData[item].id],
                                                    required: workExperienceData[item].required,
                                                    onChange: handleChange,
                                                    onBlur: handleBlur,
                                                    setFieldValue,
                                                    error: touched[workExperienceData[item].id] && Boolean(errors[workExperienceData[item].id]),
                                                    helperText: touched[workExperienceData[item].id] && errors[workExperienceData[item].id],
                                                    options: workExperienceData[item].options ? workExperienceData[item].options : undefined
                                                }))
                                            })}
                                        </MDBox>
                                        )}
                                    />
                                    <MDButton sx={{ my: 1 }} color='info' fullWidth type='submit' >Save</MDButton>
                                </Form>
                            )}
                        </Formik>}
                    </CardContent>
                </Card>
            </MDBox>
            <Footer />
        </PageLayout>
    );
}

export default WorkExperienceForm;