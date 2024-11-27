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
import entityData from "./entityData";
import { generateObjectSchema } from "global/validation";
import { generateYupSchema } from "global/validation";
import { generateFormInput } from "global/form";


function PersonalForm(){

    // navigation
    const navigate = useNavigate();
    const location = useLocation(); 
    const from = location.state?.from?.pathname || "/";

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
            if (result) setEntity(localEntity ? JSON.parse(localEntity) : result)

        }).catch((err) => {
            console.log('debug entity error result', err);

        })

    }, [])

    useEffect(() => {
        if (entity) localStorage.setItem('entity', JSON.stringify(entity))
    },[entity])

    const formik = useFormik({
        validationSchema: validationSchema,
        onSubmit: (data) => {
            console.log(data)
        },
    })

    const formContent = (props) => {
        return (<TextField {...props} />)
    }

    return (
        <PageLayout>
            <NavBar position='absolute' />
            <Grid container pt="5rem">
                <Grid size={{ xs: 12, lg: 7 }}>
                    <MDBox maxWidth="sm" mx={{ xs: 3, md: 'auto', lg: 3, xl: 'auto' }} pt="5rem">
                        <Card variant="outlined">
                            <CardContent>
                                <IconButton><Icon>keyboard_backspace</Icon></IconButton>
                                <MDTypography sx={{ mt: 3 }} variant='h3'>Personal Information</MDTypography>
                                <Divider />
                                {entity && <Formik
                                    initialValues={entity}
                                    validationSchema={validationSchema}
                                    onSubmit={(data) => {
                                        console.log(data)
                                    }}
                                >
                                    {({values, touched, errors, handleChange, handleBlur}) => (
                                        <Form>
                                            <FieldArray
                                                render={arrayHelper => (
                                                <MDBox>
                                                    {Object.keys(entityData).map((item, index) => {
                                                        // <TextField 
                                                        //     variant='outlined'
                                                        //     fullWidth
                                                        //     sx={{ my: 1 }}
                                                        //     type={entityData[item].type}
                                                        //     id={entityData[item].id}
                                                        //     name={entityData[item].id}
                                                        //     label={entityData[item].label}
                                                        //     value={values[entityData[item].id]}
                                                        //     required={entityData[item].required}
                                                        //     onChange={handleChange}
                                                        //     onBlur={handleBlur}
                                                        //     error={touched[entityData[item].id] && Boolean(errors[entityData[item].id])}
                                                        //     helperText={touched[entityData[item].id] && errors[entityData[item].id]}
                                                        // />
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
                                                            error: touched[entityData[item].id] && Boolean(errors[entityData[item].id]),
                                                            helperText: touched[entityData[item].id] && errors[entityData[item].id],
                                                            options: entityData[item].options ? entityData[item].options : undefined
                                                        }))
                                                    })}
                                                </MDBox>
                                                )}
                                            />
                                            <MDButton color='info' fullWidth type='submit' >Continue</MDButton>
                                        </Form>
                                    )}
                                </Formik>}
                            </CardContent>
                        </Card>
                    </MDBox>
                </Grid>
                <Grid display={{ xs: 'none', lg: 'block' }} size={{ lg: 5 }}>
                    <CareersStepper activeStep={0} />
                </Grid>
            </Grid>
        </PageLayout>
    );
}

export default PersonalForm;