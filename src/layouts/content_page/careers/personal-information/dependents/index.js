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
import moment from "moment";


function Dependents(){

    // navigation
    const navigate = useNavigate();
    const location = useLocation(); 
    const from = location.state?.from?.pathname || "/careers/personalinfo";
    const prevPage = () => navigate(from, { replace: true })
    const toPage = (url, params={}) => navigate(url, { state: { from: location, ...params }, replace: true })

    const {isAuth, auth} = useAuth();
    const [dependents, setDependents] = useState()

    useEffect(() => {
        handleInit()
    }, [])

    const handleInit = () => {
        var entity_id = auth['id']

        // fetch dependents
        dataServicePrivate('POST', 'entity/dependents/all', {
            filter: [{
                operator: '=',
                target: 'entity_id',
                value: entity_id,
            }],
        }).then((result) => {
            console.log('debug dependents result', result);
            result = result.data['entity_dependents']
            setDependents(result)

        }).catch((err) => {
            console.log('debug dependents error result', err);

        })
    }

    const handleDelete = (id) => {
        dataServicePrivate('POST', 'entity/dependents/delete', {id}).then((result) => {
            console.log('debug dependents delete result', result);
            handleInit()
        }).catch((err) => {
            console.log('debug dependents delete error result', err);

        })
    }

    const handleSubmit = (e) => {
        prevPage()
    }

    return (
        <PageLayout>
            <NavBar position='absolute' />
            <MDBox mt={5} maxWidth="sm" mx='auto' pt={6} pb={3}>
                <Card variant="outlined">
                    <CardContent>
                        <IconButton onClick={prevPage}><Icon>keyboard_backspace</Icon></IconButton>
                        <MDTypography sx={{ mt: 3 }} variant='h3'>Dependents</MDTypography>
                        <Divider />
                        {dependents && Object.keys(dependents).map((item, index) => (
                            <Card position='relative' sx={{ my: 2 }}>
                                <MDBox display='flex' position='absolute' right={0} p={1}>
                                    <IconButton onClick={() => toPage('/careers/personalinfo/dependentsform', { id: dependents[item].id })}><Icon>edit</Icon></IconButton>
                                    <IconButton onClick={() => handleDelete(dependents[item].id)}><Icon>delete</Icon></IconButton>
                                </MDBox>
                                <CardContent>
                                    <MDTypography variant='h5'>{dependents[item].name}</MDTypography>
                                    <MDTypography variant='body2'>
                                        {formatDateTime(dependents[item].birthday, 'MMMM DD YYYY')}
                                    </MDTypography>
                                    <MDTypography variant='body2' sx={{ textTransform: 'capitalize' }}>{dependents[item].relationship}</MDTypography>
                                </CardContent>
                            </Card>
                        ))}
                        {dependents && <MDButton
                            variant='outlined' 
                            color='secondary' 
                            fullWidth
                            startIcon={<Icon>add</Icon>}
                            onClick={() => toPage('/careers/personalinfo/dependentsform')}
                        >
                            <MDTypography variant='body2' color='secondary'>Add Dependent</MDTypography>
                        </MDButton>}
                        <form onSubmit={handleSubmit}>
                        <MDButton sx={{ my: 1 }} color='info' fullWidth type='submit' >Save</MDButton>
                        </form>
                    </CardContent>
                </Card>
            </MDBox>
            <Footer />
        </PageLayout>
    );
}

export default Dependents;