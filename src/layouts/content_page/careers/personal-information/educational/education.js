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
import { generateObjectSchema } from "global/validation";
import { generateYupSchema } from "global/validation";
import { generateFormInput } from "global/form";
import Footer from "examples/Footer";
import moment from "moment";
import elemData from "./elemData";
import seniorData from "./seniorData";
import collegeData from "./collegeData";
import techData from "./techData";
import masterData from "./masterData";


function EducationalAttainmentForm(){

    // navigation
    const navigate = useNavigate();
    const location = useLocation(); 
    const from = location.state?.from?.pathname || "/careers/personalinfo";
    const prevPage = () => navigate(from, { replace: true })
    const toPage = (url) => navigate(url, { state: { from: location }, replace: true })
    
    const {isAuth, auth} = useAuth();
    var entity_id = auth['id']
    const id = location.state?.id || null
    const [education, setEducation] = useState()
    const [endDate, setEndDate] = useState()
    const [data, setData] = useState({})

    const local = localStorage.getItem('education')
    const removeLocal = () => {
        localStorage.removeItem('education')
    }

    var ed = location.state.education
    console.log('master', masterData);

    // init validation
    var yupObject = generateObjectSchema(data)
    var yupSchema = yupObject.reduce(generateYupSchema, {})
    var validationSchema = yup.object().shape(yupSchema)

    useEffect(() => {
        // fetch education
        if (id) {
            dataServicePrivate('POST', 'entity/education/fetch', {id}).then((result) => {
                console.log('debug education result', result);
                result = result.data['entity_education'][0]
    
                setData(init(result['education']))
                setEducation(result)
            }).catch((err) => {
                console.log('debug education error result', err);
    
            })

        } else {
            if (local) {
                setEducation(JSON.parse(local))
            }
            setData(init(location.state.education))
            setEducation({ education: location.state.education })
        }
        
        
    }, [])

    useEffect(() => {
        if (education) {
            const onbeforeunloadFn = () => {
                localStorage.setItem('education', JSON.stringify(education))
            }
          
            window.addEventListener('beforeunload', onbeforeunloadFn);
            return () => {
                window.removeEventListener('beforeunload', onbeforeunloadFn);
            }
        }
    },[education])

    const init = (ed) => {
        if ( ed == 'Elementary' || ed == 'Secondary (High School)' ) return elemData
        if ( ed == 'Senior High School' ) return seniorData
        if ( ed == 'Vocational & Technical Education' ) return techData
        if ( ed == 'College' || ed == "Graduate School (Master's or Doctorate)" ) return collegeData
        if ( ed == "Graduate School (Master's or Doctorate)" ) return masterData
    }

    const handleSubmit = (data) => {
        if (id) data['id'] = id;
        data['entity_id'] = entity_id
        console.log('submit id', data);

        dataServicePrivate('POST', 'entity/education/define', data).then((result) => {
            console.log('debug education define result', result);
            removeLocal()
            prevPage()
        }).catch((err) => {
            console.log('debug education define error result', err);

        })

    }

    return (
        <PageLayout>
            <NavBar position='absolute' />
            <MDBox mt={5} maxWidth="sm" mx='auto' pt={6} pb={3}>
                <Card variant="outlined">
                    <CardContent>
                        <IconButton onClick={prevPage}><Icon>keyboard_backspace</Icon></IconButton>
                        <MDTypography sx={{ mt: 3 }} variant='h3'>Add {location.state.education}</MDTypography>
                        <Divider />
                        {education && <Formik
                            initialValues={education}
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
                                            {setEducation(values)}
                                            {console.log('values', values, isValid)}
                                            {Object.keys(data).map((item, index) => {
                                                var disabled = false
                                                if ( data[item].id == 'end_date' && ('present' in values ?? 'undergrad' in values) ) {
                                                    disabled = values.present || values.undergrad
                                                    if (disabled) {
                                                        setEndDate(values['end_date'])
                                                        delete values['end_date']
                                                    } else {
                                                        if (endDate) values['end_date'] = endDate
                                                    }
                                                }

                                                // if ( 'present' in values || 'undergrad' in values ) {
                                                //     if ( ('present' in values) && values['present'] ) {
                                                //         if ( 'undergrad' in values ) values['undergrad'] = false
                                                //     }
                                                //     if ( ('undergrad' in values) && values['undergrad'] ) {
                                                //         if ( 'present' in values ) values['present'] = false
                                                //     }
                                                // }

                                                // universal format
                                                var touch = data[item].type == 'date' ? typeof touched[data[item].id] == 'undefined' ? true : touched[data[item].id] : touched[data[item].id]
                                                var error = data[item].type == 'date' ? !(disabled) && errors[data[item].id] : errors[data[item].id]

                                                return (generateFormInput({
                                                    variant: 'outlined',
                                                    fullWidth: true,
                                                    disabled,
                                                    type: data[item].type,
                                                    id: data[item].id,
                                                    name: data[item].id,
                                                    label: data[item].label,
                                                    value: values[data[item].id],
                                                    required: data[item].required,
                                                    hidden: data[item].hidden,
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

export default EducationalAttainmentForm;