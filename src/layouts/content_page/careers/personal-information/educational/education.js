import {Card, CardContent, Chip, Container, Divider, Icon, IconButton, Link, TextField} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Switch, FormControlLabel } from "@mui/material";
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
import highData from "./highData";


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
    const [education, setEducation] = useState();
    const [endDate, setEndDate] = useState()
    const [data, setData] = useState({})

    const local = localStorage.getItem('education')
    const removeLocal = () => {
        localStorage.removeItem('education')
    }

    var ed = location.state.education
    var end_date = location.state.end_date

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
                setEducation(result)|| { education: ed }
            }).catch((err) => {
                console.log('debug education error result', err);
    
            })

        } else {
            if (local) {
                setEducation(JSON.parse(local))
            }
            setData(init(ed))
            setEducation({ education: ed })
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
        if ( ed == 'Elementary') return elemData
        if ( ed == 'Secondary (High School)' ) return highData
        if ( ed == 'Senior High School' ) return seniorData
        if ( ed == 'Vocational & Technical Education' ) return techData
        if ( ed == 'College') return collegeData
        if ( ed == "Graduate School (Master's or Doctorate)" ) return masterData
    }

    const handleSubmit = (values) => {
        console.log("Submitting education data:", values);

        if (id) values['id'] = id;
        values['entity_id'] = entity_id;
    
        // Ensure boolean fields are properly set
        values['undergrad'] = values['undergrad'] || false;
        values['present'] = values['present'] || false;
    
        // Ensure end_date is null if Presently Enrolled or Undergraduate is selected
        if (values.present || values.undergrad) {
            values['end_date'] = null;
        }
    
        console.log("Final Data before Submission:", values);
    
        dataServicePrivate('POST', 'entity/education/define', values)
            .then((result) => {
                console.log("Successfully saved education data:", result);
                removeLocal();
                prevPage();
            })
            .catch((err) => {
                console.error("Error saving education data:", err);
            });
    };
    
    
    const educationLevels = {
        Elementary: 'Edit Elementary',
        'Secondary (High School)': 'Edit High School',
        'Senior High School': 'Edit Senior High School',
        'Vocational & Technical Education': 'Edit Vocational & Technical Education',
        College: 'Edit College',
        "Graduate School (Master's or Doctorate)": 'Edit Graduate School',
      };

    return (
        <PageLayout>
            <NavBar position='absolute' />
            <MDBox mt={5} maxWidth="sm" mx='auto' pt={6} pb={3}>
                <Card variant="outlined">
                    <CardContent>
                        <IconButton onClick={prevPage}><Icon>keyboard_backspace</Icon></IconButton>
                        <MDTypography sx={{ mt: 3 }} variant='h3'>{location.state.id ? (education ? `Edit ${education.education}` : `Edit`) : `Add ${location.state.education}`}</MDTypography>                        <Divider />
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
                                                        values['end_date'] = null
                                                    } else {
                                                        if (endDate) setFieldValue('end_date', endDate)
                                                    }
                                                }

                                                if ( ('present' in values) && values['present'] ) {
                                                    if ( 'undergrad' in values ) values['undergrad'] = false
                                                }
                                                if ( ('undergrad' in values) && values['undergrad'] ) {
                                                    if ( 'present' in values ) values['present'] = false
                                                }


                                                if ( end_date ) {
                                                    var min = { minDate: moment(end_date) }
                                                    if ( data[item].type == 'date' ) data[item]?.options ? data[item]['options'] = { ...data[item]['options'], ...min } : data[item]['options'] = min
                                                
                                                }
                                                console.log("date format:",data,end_date)
                                                // universal format
                                                var touch = data[item].type == 'date' ? typeof touched[data[item].id] == 'undefined' ? true : touched[data[item].id] : touched[data[item].id]
                                                var error = data[item].type == 'date' ? !(disabled) && errors[data[item].id] : errors[data[item].id]
                                                console.log("Current Form Values:", values); // Debug log
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
                                                    options: data[item]?.options ? data[item].options : undefined
                                                }))
                                            })}
                                        </MDBox>
                                        )}
                                         
                                    />
                                    {(values.education === "College" || values.education === "Graduate School (Master's or Doctorate)") && (
                                        <>
                                        <FormControlLabel
                                                label="Presently Enrolled"
                                                sx={{ display: 'flex', alignItems: 'center' }}
                                                control={
                                                    <Switch
                                                        name="present"
                                                        checked={Boolean(values.present)}
                                                        onChange={(event) => {
                                                            const isChecked = event.target.checked;
                                                            setFieldValue("present", isChecked);

                                                            if (isChecked) {
                                                                setFieldValue("undergrad", false); 
                                                                setFieldValue("end_date", null); // Ensure end_date is null when Present is checked
                                                            } else {
                                                                setFieldValue("end_date", endDate || null); // Restore previous end_date when unchecked
                                                            }
                                                        }}
                                                    />
                                                }
                                            />
                                            <FormControlLabel
                                                label="Undergraduate"
                                                sx={{ display: 'flex', alignItems: 'center' }}
                                                control={
                                                    <Switch
                                                        name="undergrad"
                                                        checked={Boolean(values.undergrad)}
                                                        onChange={(event) => {
                                                            const isChecked = event.target.checked;
                                                            console.log("Undergraduate switch toggled:", isChecked);
                                                            
                                                            setFieldValue("undergrad", isChecked);

                                                            if (isChecked) {
                                                                setFieldValue("present", false); 
                                                                setFieldValue("end_date", null);
                                                            } else {
                                                                setFieldValue("end_date", endDate || null);
                                                            }

                                                            console.log("Updated values after switch:", values);
                                                        }}
                                                    />
                                                }
                                            />
                                        </>
                                    )}
                                    <MDButton sx={{ my: 1 }} color='info' fullWidth type='submit' startIcon={<Icon>save</Icon>}>Save</MDButton>
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