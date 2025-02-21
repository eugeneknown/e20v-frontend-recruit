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
import data from "./referenceData";
import { generateObjectSchema } from "global/validation";
import { generateYupSchema } from "global/validation";
import { generateFormInput } from "global/form";
import Footer from "examples/Footer";
import moment from "moment";
import SaveIcon from '@mui/icons-material/Save';
import { useMaterialUIController, setDialog } from "context";


function ReferenceForm({id}){
    const [controller, dispatch] = useMaterialUIController();
    const { dialog } = controller;

    // navigation
    const navigate = useNavigate();
    const location = useLocation(); 
    const from = location.state?.from?.pathname || "/careers/personalinfo";
    const prevPage = () => navigate(from, { state: { prev: 1 },replace: true })
    const toPage = (url) => navigate(url, { state: { from: location }, replace: true })

    // get id from uselocation
    // const id = location.state?.id || null
    // console.log('location id', id);

    const {isAuth, auth} = useAuth();
    const [ref, setRef] = useState()
    var entity_id = auth['id']

    const local = localStorage.getItem('reference')
    const removeLocal = () => {
        localStorage.removeItem('reference')
    }

    // init validation
    var yupObject = generateObjectSchema(data)
    var yupSchema = yupObject.reduce(generateYupSchema, {})
    var validationSchema = yup.object().shape(yupSchema)

    useEffect(() => {

        // fetch reference
        if (id) {
            dataServicePrivate('POST', 'entity/reference/fetch', {id}).then((result) => {
                console.log('debug experience result', result);
                result = result.data['entity_reference'][0]
                setRef(result)
            }).catch((err) => {
                console.log('debug experience error result', err);
    
            })
        } else {
            setRef({})
        }

    }, [id])

    useEffect(() => {
        if (ref) {
            const onbeforeunloadFn = () => {
                localStorage.setItem('ref', JSON.stringify(ref))
            }
          
            window.addEventListener('beforeunload', onbeforeunloadFn);
            return () => {
                window.removeEventListener('beforeunload', onbeforeunloadFn);
            }
        }
    },[ref])

    const handleSubmit = (data) => {
        console.log('submit', data);

        dataServicePrivate('POST', 'entity/reference/define', {entity_id, ...data}).then((result) => {
            console.log('debug reference define result', result);
            removeLocal()
            setDialog(dispatch, { ...dialog, open: false });
        }).catch((err) => {
            console.log('debug reference define error result', err);

        })
    }

    return (
        <MDBox>
            <MDTypography sx={{ mt: 3 }} variant='h3'>
                {ref && ref?.id ? 'Edit Reference' : 'Add Reference'}
            </MDTypography>
            <Divider />
            {ref && (
                <Formik
                    initialValues={ref}
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
                                    {setRef(values)}
                                    {Object.keys(data).map((item, index) => {
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
                            <MDButton sx={{ my: 1 }} color='info' fullWidth type='submit' startIcon={<SaveIcon />}>Save</MDButton>
                        </Form>
                    )}
                </Formik>
            )}
        </MDBox>
    );    
}

export default ReferenceForm;