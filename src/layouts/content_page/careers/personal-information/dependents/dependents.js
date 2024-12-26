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
import formData from "./dependentsData";
import { generateObjectSchema } from "global/validation";
import { generateYupSchema } from "global/validation";
import { generateFormInput } from "global/form";
import Footer from "examples/Footer";
import moment from "moment";


function DependentsForm(){

    // navigation
    const navigate = useNavigate();
    const location = useLocation(); 
    const from = location.state?.from?.pathname || "/careers/personalinfo";
    const prevPage = () => navigate(from, { replace: true })
    const toPage = (url) => navigate(url, { state: { from: location }, replace: true })

    // get id from uselocation
    const id = location.state?.id || null
    console.log('location id', id);

    const {isAuth, auth} = useAuth();
    const [dependents, setDependents] = useState()

    const local = localStorage.getItem('dependents')
    const removeLocal = () => {
        localStorage.removeItem('dependents')
    }

    // init validation
    var yupObject = generateObjectSchema(formData)
    var yupSchema = yupObject.reduce(generateYupSchema, {})
    var validationSchema = yup.object().shape(yupSchema)

    useEffect(() => {
        // fetch dependents
        if ( id ) {
            dataServicePrivate('POST', 'entity/dependents/fetch', {id}).then((result) => {
                console.log('debug dependents result', result);
                result = result.data['entity_dependents'][0]
                setDependents(result)
    
            }).catch((err) => {
                console.log('debug dependents error result', err);
    
            })
        } else {
            setDependents({})
        }

    }, [])

    useEffect(() => {
        if (dependents) {
            const onbeforeunloadFn = () => {
                localStorage.setItem('dependents', JSON.stringify(dependents))
            }
          
            window.addEventListener('beforeunload', onbeforeunloadFn);
            return () => {
                window.removeEventListener('beforeunload', onbeforeunloadFn);
            }
        }
    },[dependents])

    const handleSubmit = (data) => {
        dataServicePrivate('POST', 'entity/dependents/define', {...data, entity_id: auth['id']}).then((result) => {
            console.log('debug dependents result', result);
            removeLocal()
            prevPage()
        }).catch((err) => {
            console.log('debug dependents error result', err);

        })
    }

    return (
        <PageLayout>
            <NavBar position='absolute' />
            <MDBox mt={5} maxWidth="sm" mx='auto' pt={6} pb={3}>
                <Card variant="outlined">
                    <CardContent>
                        <IconButton onClick={prevPage}><Icon>keyboard_backspace</Icon></IconButton>
                        <MDTypography sx={{ mt: 3 }} variant='h3'>Add dependent</MDTypography>
                        <Divider />
                        {dependents && <Formik
                            initialValues={dependents}
                            validationSchema={validationSchema}
                            onSubmit={(data) => {
                                handleSubmit(data)
                            }}
                        >
                            {({values, touched, errors, isValid, handleChange, handleBlur, setFieldValue, setFieldTouched}) => (
                                <Form>
                                    <FieldArray
                                        render={arrayHelper => (
                                        <MDBox>
                                            {setDependents(values)}
                                            {console.log('values', values, isValid)}
                                            {Object.keys(formData).map((item, index) => {
                                                // universal format
                                                var touch = formData[item].type == 'date' ? typeof touched[formData[item].id] == 'undefined' ? true : touched[formData[item].id] : touched[formData[item].id]
                                                var error = formData[item].type == 'date' ? formData[item].required && errors[formData[item].id] : errors[formData[item].id]

                                                return (generateFormInput({
                                                    variant: 'outlined',
                                                    fullWidth: true,
                                                    type: formData[item].type,
                                                    id: formData[item].id,
                                                    name: formData[item].id,
                                                    label: formData[item].label,
                                                    value: values[formData[item].id],
                                                    required: formData[item].required,
                                                    onChange: handleChange,
                                                    onBlur: handleBlur,
                                                    setFieldValue,
                                                    setFieldTouched,
                                                    error: touch && Boolean(error),
                                                    helperText: touch && error,
                                                    options: formData[item].options ? formData[item].options : undefined
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

export default DependentsForm;