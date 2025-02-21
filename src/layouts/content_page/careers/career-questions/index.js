import {Card, CardContent, Checkbox, Chip, Container, Dialog, DialogActions, DialogContent, Divider, Icon, IconButton, Link, Step, StepLabel, Stepper, TextField} from "@mui/material";
import Grid from "@mui/material/Grid2";

import PageLayout from "examples/LayoutContainers/PageLayout";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import useAuth from "hooks/useAuth";
import { useEffect, useRef, useState } from "react";
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
import CareersStepper from "../careers-stepper";
import { useMaterialUIController, setLoading } from "context";
import ReferenceInformation from "../reference-information";


function CareerQuestionsForm(){

    // controller
    const [controller, dispatch] = useMaterialUIController()
    const { loading } = controller

    // local
    const local = localStorage.getItem('answers')
    const removeLocalData = () => {
        localStorage.removeItem('answers')
    }

    // navigation
    const navigate = useNavigate();
    const location = useLocation(); 
    const from = location.state?.from?.pathname || "/careers/personalinfo";
    const prevPage = () => navigate(from, { replace: true })
    const toPage = (url, params={}) => navigate(url, { state: { from: location, ...params }, replace: true })

    const {isAuth, auth} = useAuth();
    const [answers, setAnswers] = useState(local ? JSON.parse(local) : {})
    const [questions, setQuestions] = useState()
    const [step, setStep] = useState(0)
    const [answerFormData, setAnswerFormData] = useState()
    const [ref, setRef] = useState()
    const err = useRef()

    const swipeRef = useRef()

    const [pageStep, setPageStep] = useState(location.state?.prev ?? 0)
    const pageSwipeRef = useRef()

    const [open, setOpen] = useState(false)
    const [content, setContent] = useState()
    
    // must be revice
    const careerId = localStorage.getItem('career_id')
    console.log('career id', careerId);

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

        dataServicePrivate('POST', 'entity/reference/all', {
            filter: [{
                operator: '=',
                target: 'entity_id',
                value: entity_id,
            }],
        }).then((result) => {
            console.log('debug reference result', result);
            result = result.data['entity_reference']
            setRef(result)

        }).catch((err) => {
            console.log('debug reference error result', err);

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
                            // || data[order]['questions'].type == 'label'
                        ) 
                        ? {options: (data[order]['questions'].value).split(', ')} 
                        : {options: data[order]['questions'].value}
                    })

                    continue
                }

            }
            schema.push(question)

        })
        setQuestions(schema)
        console.log('debug question schema', schema);

    }

    useEffect(() => {
        if (answers) {
            const onbeforeunloadFn = () => {
                localStorage.setItem('answers', JSON.stringify(answers))
            }
          
            window.addEventListener('beforeunload', onbeforeunloadFn);
            return () => {
                window.removeEventListener('beforeunload', onbeforeunloadFn);
            }
        }
    },[answers])

    const authorization = (
        <MDBox mt={3}>
            <MDBox display='flex' justifyContent='center'>
                <MDTypography
                    component="a"
                    variant="button"
                    fontWeight="bold"
                    color="info"
                    sx={{ mb: 3 }}
                >
                    Authorization Letter
                </MDTypography>
            </MDBox>
            <MDTypography variant="overline" gutterBottom sx={{ display: 'block', textIndent: '30px', textAlign: 'justify', textJustify: 'inter-word' }}>
                In the course of conducting an investigation into my background, I authorize the Company to contact any government agencies, 
                previous employers, educational institutions, public or private entities, and individuals, as well as the listed references.
            </MDTypography>
            <MDTypography variant="overline" gutterBottom sx={{ display: 'block' }}></MDTypography> 
            <MDTypography variant="overline" gutterBottom sx={{ display: 'block', textIndent: '30px', textAlign: 'justify', textJustify: 'inter-word' }}>
                I authorize the Company to release all background investigation data to the Company's designated hiring officers for use in evaluating
                my application for employment or for continued empoyment. I understand and acknowledge that the information gathered and provided to hiring officers by the 
                Company may be detrimental to my application for employment or continued employment.
            </MDTypography>
            <MDTypography variant="overline" gutterBottom sx={{ display: 'block' }}></MDTypography> 
            <MDTypography variant="overline" gutterBottom sx={{ display: 'block', textIndent: '30px', textAlign: 'justify', textJustify: 'inter-word' }}>
                I also authorize any individual, company, firm, corporation, or public agency to disclose any and all information pertaining to me, whether verbal or written.
                I hereby release from all liability any person, firm, or organization that provides information or records in accordance with this authorization.
            </MDTypography>
            <MDTypography variant="overline" gutterBottom sx={{ display: 'block' }}></MDTypography> 
            <MDTypography variant="overline" gutterBottom sx={{ display: 'block', textIndent: '30px', textAlign: 'justify', textJustify: 'inter-word' }}>
                By signing this document, I give the Company my permission to conduct an initial background check for employment application purposes, as well as any
                subsequent background checks deemed necessary during the course of my employment with the Company.
            </MDTypography>
        </MDBox>
    )

    const term = (
        <MDBox mt={3}>
            <MDBox display='flex' justifyContent='center'>
                <MDTypography
                    component="a"
                    variant="button"
                    fontWeight="bold"
                    color="info"
                    sx={{ mb: 3 }}
                >
                    Terms and Conditions
                </MDTypography>
            </MDBox>
            <MDTypography variant="overline" gutterBottom sx={{ display: 'block', textIndent: '30px', textAlign: 'justify', textJustify: 'inter-word' }}>
                I hereby certify that, to the best of my knowledge, my responses to the questions on this application are correct, 
                and that any dishonesty or falsification may jeopardize my employment application.
            </MDTypography>
            <MDTypography variant="overline" gutterBottom sx={{ display: 'block', textIndent: '30px', textAlign: 'justify', textJustify: 'inter-word' }}>
                I hereby release all persons, companies, or corporations who provide such information from any liability or responsibility. I also 
                agree to submit any future examination that Eighty20 Virtual may require of me, and that the foregoing examination questions and answers may be 
                used in any way that the company desires.
            </MDTypography>
            <MDTypography variant="overline" gutterBottom sx={{ display: 'block', textIndent: '30px', textAlign: 'justify', textJustify: 'inter-word' }}>
                I am fully aware of the consequences of non-declaration, untruthfulness, and dishonesty that may result in the termination of my employment contract.
            </MDTypography>
        </MDBox>
    )

    const AuthLetter = () => (
        <MDBox>
            <MDBox>
                <MDBox display={'flex'} alignItems='center'>
                    <Checkbox sx={{ alignItems: 'unset', pl: 0 }} required />
                    <MDTypography
                        variant="overline"
                        fontWeight="regular"
                        color="text"
                        sx={{ display: 'block', cursor: 'pointer' }}
                    >
                        I have read, understand and agree to the 
                        <MDTypography
                            component="a"
                            variant="overline"
                            fontWeight="bold"
                            color="info"
                            textGradient
                            sx={{ ml: '4px' }}
                            onClick={() => {
                                setContent(authorization);
                                setOpen(true)
                            }}
                        >
                            Authorization Letter
                        </MDTypography>
                    </MDTypography>
                </MDBox> 
                <MDBox display={'flex'} alignItems='center'>
                    <Checkbox sx={{ alignItems: 'unset', pl: 0 }} required />
                    <MDTypography
                        variant="overline"
                        fontWeight="regular"
                        color="text"
                        sx={{ display: 'block' }}
                    >
                        I have read, understand and agree to the 
                        <MDTypography
                            component="a"
                            variant="overline"
                            fontWeight="bold"
                            color="info"
                            textGradient
                            sx={{ mx: '4px', cursor: 'pointer' }}
                            onClick={() => {
                                setContent(term);
                                setOpen(true)
                            }}
                        >
                            Terms and Conditions
                        </MDTypography>  
                    </MDTypography>
                </MDBox> 
            </MDBox>
        </MDBox>
    )

    const handleNav = (data, opt) => {
        console.log('debug submit', data, opt);

        if ( step == Object.keys(questions).length-1 ) {
            setAnswerFormData(data)
            setPageStep(pageStep+1)
        } else {
            opt.setTouched({})
            setStep(step+1)
        }

    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (ref && Object.keys(ref).length >= 2) {
            var formData = new FormData()

            Object.keys(answerFormData).map((item, index) => {
                if (answerFormData[item]) {
                    if (Array.isArray(answerFormData[item])) {
                        formData.append(item, answerFormData[item].join(', '))
                    } else {
                        formData.append(item, answerFormData[item])
                    }
                }
            })
            formData.append('entity_id', auth['id'])
            formData.append('careers_id', careerId)

            formData.forEach((item, index) => {
                console.log('debug form data', index, item);
            })

            setLoading(dispatch, true)

            dataServicePrivate('POST', 'hr/careers/entity/submitv2', formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }).then((result) => {
                console.log('debug answers define result', result);
                removeLocalData()
                toPage('/careers/submitted')
            }).catch((err) => {
                console.log('debug answers define error result', err);

            }).finally((e) => {
                console.log('debug answers define finally result', e);
                setLoading(dispatch, false)
            })
        } else {
            if (err.current) {
                err.current.scrollIntoView({
                    behavior: 'smooth', // Changed to smooth for better experience
                    block: 'center',
                    inline: 'center',
                });
            }
        }
    }

    const SwipeHeightChange = () => {
        setTimeout(() => {
            if (swipeRef) swipeRef.current.updateHeight()
        }, 500);
    }

    const PageSwipeHeightChange = () => {
        setTimeout(() => {
            if (pageSwipeRef) pageSwipeRef.current.updateHeight()
        }, 500);
    }

    return (
        <PageLayout>
            <NavBar position='absolute' />
            <Grid container pt={6} pb={3}>
                <Grid size={{ xs: 12, lg: 7 }}>
                    <MDBox mt={5} maxWidth="sm" mx='auto'>
                        <Card variant="outlined">
                            {questions && answers &&
                                <SwipeableViews
                                    index={pageStep}
                                    animateHeight
                                    ref={pageSwipeRef}
                                >
                                    <CardContent>
                                        <IconButton onClick={prevPage}><Icon>keyboard_backspace</Icon></IconButton>
                                        { questions && answers && 
                                        <Stepper activeStep={step} alternativeLabel>
                                            {Object.keys(questions).map((item, index) => (
                                                <Step key={index}>
                                                    <StepLabel>Question Group {index+1}</StepLabel>
                                                </Step>
                                            ))}
                                        </Stepper>}
                                        <Divider />
                                        <Formik
                                            initialValues={answers}
                                            validationSchema={validationSchema(questions[step])}
                                            onSubmit={handleNav}
                                        >
                                            {({values, touched, errors, isValid, handleChange, handleBlur, setFieldValue, setFieldTouched}) => (
                                                <Form>
                                                    <SwipeableViews
                                                        index={step}
                                                        animateHeight
                                                        ref={swipeRef}
                                                    >
                                                        {Object.keys(questions).map((item, index) => (
                                                            <FieldArray
                                                                render={arrayHelper => (
                                                                <MDBox>
                                                                    {/* {console.log('values', values)} */}
                                                                    {SwipeHeightChange()}
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
                                                                    <Divider />
                                                                </MDBox>
                                                                )}
                                                            />
                                                        ))}
                                                    </SwipeableViews>
                                                    <MDBox style={{ display: 'flex' }} justifyContent={step > 0 ? 'space-between' : 'end'}>
                                                        {step > 0 && (
                                                        <MDButton onClick={() => setStep(step-1)} sx={{ my: 1,  
                                                            backgroundColor: '#666666 !important', 
                                                            color: 'white !important', 
                                                            '&:hover': {
                                                            backgroundColor: '#555555 !important', 
                                                            boxShadow: 'none',
                                                            color: 'white !important'
                                                            },
                                                            '&.Mui-disabled': {
                                                            backgroundColor: '#666666 !important',
                                                            color: 'white !important',
                                                            opacity: 0.5,
                                                            } }} startIcon={<Icon sx={{ color: 'white' }}>navigate_before</Icon>}>
                                                            Back
                                                        </MDButton>
                                                        )}
                                                        <MDBox>
                                                            <MDButton sx={{ my: 1 }} color='info' type="submit" endIcon={<Icon>navigate_next</Icon>}>
                                                                {step == Object.keys(questions).length-1 ? 'Continue' : 'Next'}
                                                            </MDButton>
                                                        </MDBox>
                                                    </MDBox>
                                                </Form>
                                            )}
                                        </Formik>
                                        {PageSwipeHeightChange()}
                                    </CardContent>
                                    <CardContent>
                                        <IconButton onClick={()=>setPageStep(pageStep-1)}><Icon>keyboard_backspace</Icon></IconButton>
                                        <ReferenceInformation />
                                        <Divider />
                                        <form onSubmit={handleSubmit}>
                                        <AuthLetter />
                                        <MDButton sx={{ my: 1 }} color='info' fullWidth type='submit' startIcon={<Icon>send</Icon>} >Submit Application</MDButton>
                                        </form>
                                    </CardContent>
                                </SwipeableViews>
                            }
                        </Card>
                    </MDBox>
                </Grid>
                <Grid display={{ xs: 'none', lg: 'block' }} size={{ lg: 5 }}>
                    <CareersStepper activeStep={pageStep+1} orientation='vertical' position='fixed' />
                </Grid>
            </Grid>
            <Footer />
            <Dialog
                open={open}
            >
                <DialogContent>{content}</DialogContent>
                <DialogActions>
                    <MDButton onClick={()=>setOpen(false)} color='error'>Close</MDButton>
                </DialogActions>
            </Dialog>
        </PageLayout>
    );
}

export default CareerQuestionsForm;