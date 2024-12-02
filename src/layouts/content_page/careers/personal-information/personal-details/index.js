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
import entityData from "./detailsData";
import { generateObjectSchema } from "global/validation";
import { generateYupSchema } from "global/validation";
import { generateFormInput } from "global/form";
import Footer from "examples/Footer";


function PersonalForm(){

    // navigation
    const navigate = useNavigate();
    const location = useLocation(); 
    const from = location.state?.from?.pathname || "/";
    const prevPage = () => navigate(from, { replace: true })
    const toPage = (url) => navigate(url, { state: { from: location }, replace: true })

    const {isAuth, auth} = useAuth();
    const [entity, setEntity] = useState()

    const localEntity = localStorage.getItem('entity')
    const removeLocalEntity = () => {
        localStorage.removeItem('entity')
    }

    // init validation
    var yupObject = generateObjectSchema(entityData)
    var yupSchema = yupObject.reduce(generateYupSchema, {})
    var validationSchema = yup.object().shape(yupSchema)
    console.log('debug validation schema', validationSchema);

    useEffect(() => {
        var entity_id = auth['id']

        // fetch entity
        dataServicePrivate('POST', 'entity/entities/all', {
            filter: [{
                operator: '=',
                target: 'id',
                value: entity_id,
            }],
        }).then((result) => {
            console.log('debug entity result', result);
            result = result.data['entity'][0]
            if (localEntity) {
                result = JSON.parse(localEntity)
            } else {
                localStorage.setItem('entity', JSON.stringify(result))
            }

            setEntity(result)

        }).catch((err) => {
            console.log('debug entity error result', err);

        })

    }, [])

    useEffect(() => {
        if (entity) {
            const onbeforeunloadFn = () => {
                localStorage.setItem('entity', JSON.stringify(entity))
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
            removeLocalEntity()
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
                            {({values, touched, errors, handleChange, handleBlur, setFieldValue}) => (
                                <Form>
                                    <FieldArray
                                        render={arrayHelper => (
                                        <MDBox>
                                            {setEntity(values)}
                                            {Object.keys(entityData).map((item, index) => {
                                                return (generateFormInput({
                                                    variant: 'outlined',
                                                    fullWidth: true,
                                                    type: entityData[item].type,
                                                    id: entityData[item].id,
                                                    name: entityData[item].id,
                                                    label: entityData[item].label,
                                                    value: values[entityData[item].id],
                                                    required: entityData[item].required,
                                                    onChange: handleChange,
                                                    onBlur: handleBlur,
                                                    setFieldValue,
                                                    error: touched[entityData[item].id] && Boolean(errors[entityData[item].id]),
                                                    helperText: touched[entityData[item].id] && errors[entityData[item].id],
                                                    options: entityData[item].options ? entityData[item].options : undefined
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

export default PersonalForm;