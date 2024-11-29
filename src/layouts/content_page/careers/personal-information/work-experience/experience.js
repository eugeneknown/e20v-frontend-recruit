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

import * as yup from 'yup';
import { FieldArray, Form, Formik } from 'formik';
import experienceData from "./experienceData";
import { generateObjectSchema } from "global/validation";
import { generateYupSchema } from "global/validation";
import { generateFormInput } from "global/form";
import Footer from "examples/Footer";


function ExperienceForm(){

    // navigation
    const navigate = useNavigate();
    const location = useLocation(); 
    const from = location.state?.from?.pathname || "/careers/personalinfo";
    const prevPage = () => navigate(from, { replace: true })
    const toPage = (url) => navigate(url, { state: { from: location }, replace: true })

    const {isAuth, auth} = useAuth();
    const [experience, setExperience] = useState()

    const local = localStorage.getItem('experience')
    const removeLocal = () => {
        localStorage.removeItem('experience')
    }

    // init validation
    var yupObject = generateObjectSchema(experienceData)
    var yupSchema = yupObject.reduce(generateYupSchema, {})
    var validationSchema = yup.object().shape(yupSchema)

    useEffect(() => {
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
            result = result.data['experience'][0]['details']
            if (local) {
                result = JSON.parse(local)
            } else {
                localStorage.setItem('experience', JSON.stringify(result))
            }
            setExperience(result)

        }).catch((err) => {
            console.log('debug experience error result', err);

        })

    }, [])

    useEffect(() => {
        if (experience) {
            const onbeforeunloadFn = () => {
                localStorage.setItem('experience', JSON.stringify(experience))
            }
          
            window.addEventListener('beforeunload', onbeforeunloadFn);
            return () => {
                window.removeEventListener('beforeunload', onbeforeunloadFn);
            }
        }
    },[experience])

    const handleSubmit = (data) => {
        dataServicePrivate('POST', 'entity/experience/details/define', data).then((result) => {
            console.log('debug experience define result', result);
            removeLocal()
            navigate('/careers/personalinfo', { replace: true })
        }).catch((err) => {
            console.log('debug experience define error result', err);

        })
    }

    return (
        <PageLayout>
            <NavBar position='absolute' />
            <MDBox mt={5} maxWidth="sm" mx='auto' pt={6} pb={3}>
                <Card variant="outlined">
                    <CardContent>
                        <IconButton onClick={prevPage}><Icon>keyboard_backspace</Icon></IconButton>
                        <MDTypography sx={{ mt: 3 }} variant='h3'>Add work experience</MDTypography>
                        <Divider />
                        {experience && <Formik
                            initialValues={experience}
                            validationSchema={validationSchema}
                            onSubmit={(data) => {
                                // handleSubmit(data)
                                console.log('debug submit', data);
                            }}
                        >
                            {({values, touched, errors, handleChange, handleBlur, setFieldValue}) => (
                                <Form>
                                    <FieldArray
                                        render={arrayHelper => (
                                        <MDBox>
                                            {setExperience(values)}
                                            {console.log('values', values)}
                                            {Object.keys(experienceData).map((item, index) => {
                                                return (generateFormInput({
                                                    variant: 'outlined',
                                                    fullWidth: true,
                                                    disabled: experienceData[item].id == 'end_date' && values?.present ? values.present : false,
                                                    type: experienceData[item].type,
                                                    id: experienceData[item].id,
                                                    name: experienceData[item].id,
                                                    label: experienceData[item].label,
                                                    value: values[experienceData[item].id],
                                                    required: experienceData[item].required,
                                                    onChange: handleChange,
                                                    onBlur: handleBlur,
                                                    setFieldValue,
                                                    error: touched[experienceData[item].id] && Boolean(errors[experienceData[item].id]),
                                                    helperText: touched[experienceData[item].id] && errors[experienceData[item].id],
                                                    options: experienceData[item].options ? experienceData[item].options : undefined
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

export default ExperienceForm;