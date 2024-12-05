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

import * as yup from 'yup';
import { Field, FieldArray, Form, Formik, useFormik } from 'formik';
import data from "./entityData";
import { generateObjectSchema } from "global/validation";
import { generateYupSchema } from "global/validation";
import { generateFormInput } from "global/form";
import Footer from "examples/Footer";


function CareerQuestionsForm(){

    // navigation
    const navigate = useNavigate();
    const location = useLocation(); 
    const from = location.state?.from?.pathname || "/";
    const prevPage = () => navigate(from, { replace: true })
    const toPage = (url, params={}) => navigate(url, { state: { from: location, ...params }, replace: true })

    const {isAuth, auth} = useAuth();
    const [entity, setEntity] = useState()

    const careerId = localStorage.getItem('career_id')
    console.log('career id', careerId);

    const localEntity = localStorage.getItem('answers')
    const removeLocalData = () => {
        localStorage.removeItem('answers')
    }

    // init validation
    var yupObject = generateObjectSchema(data)
    var yupSchema = yupObject.reduce(generateYupSchema, {})
    var validationSchema = yup.object().shape(yupSchema)

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
            result = result.data['careers'][0]
            // if (localEntity) {
            //     result = JSON.parse(localEntity)
            // } else {
            //     localStorage.setItem('entity', JSON.stringify(result))
            // }

            // setEntity(result)

        }).catch((err) => {
            console.log('debug careers error result', err);

        })

    }, [])

    useEffect(() => {
        if (entity) {
            const onbeforeunloadFn = () => {
                localStorage.setItem('answers', JSON.stringify(entity))
            }
          
            window.addEventListener('beforeunload', onbeforeunloadFn);
            return () => {
                window.removeEventListener('beforeunload', onbeforeunloadFn);
            }
        }
    },[entity])

    const handleSubmit = (data) => {
        dataServicePrivate('POST', 'entity/entities/define', data).then((result) => {
            console.log('debug entity define result', result);
            removeLocalData()
            navigate('/careers/personalinfo', { replace: true })
        }).catch((err) => {
            console.log('debug entity define error result', err);

        })
    }

    return (
        <PageLayout>
            <NavBar position='absolute' />
            <MDBox mt={5} maxWidth="sm" mx='auto' pt={6} pb={3}>
                <Card variant="outlined">
                    <CardContent>
                        <IconButton onClick={prevPage}><Icon>keyboard_backspace</Icon></IconButton>
                        <MDTypography sx={{ mt: 3 }} variant='h3'>Personal Information</MDTypography>
                        <Divider />
                        {entity && <Formik
                            initialValues={entity}
                            validationSchema={validationSchema}
                            onSubmit={(data) => {
                                console.log(data)
                                handleSubmit(data)
                            }}
                        >
                            {({values, touched, errors, isValid, handleChange, handleBlur, setFieldValue, setFieldTouched}) => (
                                <Form>
                                    <FieldArray
                                        render={arrayHelper => (
                                        <MDBox>
                                            {setEntity(values)}
                                            {Object.keys(entityData).map((item, index) => {

                                                // universal format
                                                var touch = data[item].type == 'date' ? typeof touched[data[item].id] == 'undefined' ? true : touched[data[item].id] : touched[data[item].id]
                                                var error = data[item].type == 'date' ? data[item].required && errors[data[item].id] : errors[data[item].id]
                                                return (generateFormInput({
                                                    variant: 'outlined',
                                                    fullWidth: true,
                                                    type: data[item].type,
                                                    id: data[item].id,
                                                    name: data[item].id,
                                                    label: data[item].label,
                                                    value: values[data[item].id],
                                                    required: data[item].required,
                                                    onChange: handleChange,
                                                    onBlur: handleBlur,
                                                    setFieldValue,
                                                    setFieldTouched,
                                                    error: touch && Boolean(error),
                                                    helperText: touch && error,
                                                    options: data[item].options ? data[item].options : undefined
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

export default CareerQuestionsForm;