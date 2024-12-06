import {Card, CardContent, Chip, Container, Divider, Icon, IconButton, Link, Step, StepLabel, Stepper, TextField} from "@mui/material";
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
import { generateObjectSchema } from "global/validation";
import { generateYupSchema } from "global/validation";
import { generateFormInput } from "global/form";
import Footer from "examples/Footer";
import SwipeableViews from "react-swipeable-views";


function CareerQuestionsForm(){

    // navigation
    const navigate = useNavigate();
    const location = useLocation(); 
    const from = location.state?.from?.pathname || "/";
    const prevPage = () => navigate(from, { replace: true })
    const toPage = (url, params={}) => navigate(url, { state: { from: location, ...params }, replace: true })

    const {isAuth, auth} = useAuth();
    const [answers, setAnswers] = useState()
    const [questions, setQuestions] = useState()
    const [step, setStep] = useState(0)

    // must be revice
    const careerId = localStorage.getItem('career_id')
    console.log('career id', careerId);

    const local = localStorage.getItem('answers')
    const removeLocalData = () => {
        localStorage.removeItem('answers')
    }

    const validationSchema = (data) => {
        // init validation
        var yupObject = generateObjectSchema(data)
        var yupSchema = yupObject.reduce(generateYupSchema, {})
        return yup.object().shape(yupSchema)
    }

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
            result = result.data['careers'][0].has
            generateQuestionsSchema(result)

        }).catch((err) => {
            console.log('debug careers error result', err);

        })

    }, [])

    const generateQuestionsSchema = (data) => {
        var schema = []

        // get sections
        var section = []
        Object.keys(data).map((item, index)=>{
            if ( !(data[item].section in section) ) section.push(data[item].section)
        })

        // get questions in order sequence
        section.forEach((item) => {

            var question = []
            for (var i=0; i<Object.keys(data).length; i++) {

                var order = Object.keys(data).findIndex((_item) => data[_item].section == item && data[_item].order == i)
                if ( order>=0 ) {
                    question.push({
                        id: data[order]['questions'].id,
                        label: data[order]['questions'].title,
                        type: data[order]['questions'].type,
                        required: data[order]['questions'].required,
                        ...(
                            data[order]['questions'].type == 'select' 
                            || data[order]['questions'].type == 'check'
                            || data[order]['questions'].type == 'radio'
                            || data[order]['questions'].type == 'file'
                            || data[order]['questions'].type == 'link'
                            || data[order]['questions'].type == 'label'
                        ) 
                        && {options: (data[order]['questions'].value).split(', ')}
                    })

                    continue
                }

            }
            schema.push(question)

        })
        setQuestions(schema)
        console.log('debug question schema', schema);

        Object.keys(data).map((item, index) => {
            setAnswers(prev => (
                data[item]['questions'].type != 'link' && data[item]['questions'].type != 'label' &&
                {
                    ...prev,
                    [data[item]['questions'].id]: '',
                }
            ))
        })

    }

    // useEffect(() => {
    //     if (entity) {
    //         const onbeforeunloadFn = () => {
    //             localStorage.setItem('answers', JSON.stringify(entity))
    //         }
          
    //         window.addEventListener('beforeunload', onbeforeunloadFn);
    //         return () => {
    //             window.removeEventListener('beforeunload', onbeforeunloadFn);
    //         }
    //     }
    // },[entity])

    const handleSubmit = (data, opt) => {
        console.log('debug submit', data, opt);

        if ( step == Object.keys(questions).length-1 ) {
            var formData = new FormData()

            Object.keys(data).map((item, index) => {
                if (data[item]) formData.append(item, data[item])
            })
            formData.append('entity_id', auth['id'])
            formData.append('careers_id', careerId)

            formData.forEach((item, index) => {
                console.log('debug form data', index, item);
            })

            dataServicePrivate('POST', 'hr/careers/entity/submitv2', formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }).then((result) => {
                console.log('debug answers define result', result);
                // removeLocalData()
                // navigate('/careers/personalinfo', { replace: true })
            }).catch((err) => {
                console.log('debug answers define error result', err);
    
            })
        } else {
            opt.setTouched({})
            setStep(step+1)
        }

    }

    return (
        <PageLayout>
            <NavBar position='absolute' />
            <MDBox mt={5} maxWidth="sm" mx='auto' pt={6} pb={3}>
                <Card variant="outlined">
                    <CardContent>
                        <IconButton onClick={prevPage}><Icon>keyboard_backspace</Icon></IconButton>
                        <Stepper activeStep={step} alternativeLabel>
                            {questions && answers && Object.keys(questions).map((item, index) => (
                                <Step key={index}>
                                    <StepLabel>Question Group {index+1}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                        <Divider />
                        {questions && answers && <Formik
                            initialValues={answers}
                            validationSchema={validationSchema(questions[step])}
                            onSubmit={handleSubmit}
                        >
                            {({values, touched, errors, isValid, handleChange, handleBlur, setFieldValue, setFieldTouched}) => (
                                <Form>
                                    <SwipeableViews
                                        index={step}
                                        animateHeight
                                    >
                                        {Object.keys(questions).map((item, index) => (
                                            <FieldArray
                                                render={arrayHelper => (
                                                <MDBox>
                                                    {setAnswers(values)}
                                                    {Object.keys(questions[item]).map((_item, index) => {
                                                        var data = questions[item][_item]
                                                        // console.log('data', data);
                                                        // universal format
                                                        var touch = data.type == 'date' ? typeof touched[data.id] == 'undefined' ? true : touched[data.id] : touched[data.id]
                                                        var error = data.type == 'date' ? data.required && errors[data.id] : errors[data.id]
                                                        return (generateFormInput({
                                                            variant: 'outlined',
                                                            fullWidth: true,
                                                            type: data.type,
                                                            id: data.id,
                                                            name: data.id,
                                                            label: data.label,
                                                            value: values[data.id],
                                                            required: item == step ? data.required : false,
                                                            onChange: handleChange,
                                                            onBlur: handleBlur,
                                                            setFieldValue,
                                                            setFieldTouched,
                                                            error: touch && Boolean(error),
                                                            helperText: touch && error,
                                                            options: data.options ? data.options : undefined
                                                        }))
                                                    })}
                                                </MDBox>
                                                )}
                                            />
                                        ))}
                                    </SwipeableViews>
                                    <MDBox style={{ display: 'flex' }} justifyContent={step > 0 ? 'space-between' : 'end'}>
                                        {step > 0 && (
                                        <MDButton onClick={() => setStep(step-1)} sx={{ my: 1 }} color='secondary'>
                                            Back
                                        </MDButton>
                                        )}
                                        <MDBox>
                                            <MDButton sx={{ my: 1 }} color='info' type="submit">
                                                {step == Object.keys(questions).length-1 ? 'Continue' : 'Next'}
                                            </MDButton>
                                        </MDBox>
                                    </MDBox>
                                    {/* <MDButton sx={{ my: 1 }} color='info' fullWidth type='submit' >Save</MDButton> */}
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