import {Card, CardContent, Typography, Chip, Container, Divider, Icon, IconButton, Link, TextField} from "@mui/material";
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
import workExperienceData from "./work-experienceData";
import moment from "moment";
import { useMaterialUIController, setLoading, setDialog } from "context";
import { fontFamily, fontSize, fontWeight, textTransform } from "@mui/system";


function WorkExperienceForm(){
    const [controller, dispatch] = useMaterialUIController();
    const { dialog } = controller;
    // navigation
    const navigate = useNavigate();
    const location = useLocation(); 
    const from = location.state?.from?.pathname || "/careers/personalinfo";
    const prevPage = () => navigate(from, { replace: true })
    const toPage = (url, params={}) => navigate(url, { state: { from: location, ...params }, replace: true })

    const {isAuth, auth} = useAuth();
    const [experience, setExperience] = useState()
    const [details, setDetails] = useState()
    const [years, setYears] = useState()
    const [months, setMonths] = useState()

    // remove personal local data
    localStorage.removeItem('experience')

    const local = localStorage.getItem('work_experience')
    const removeLocal = () => {
        localStorage.removeItem('work_experience')
    }

    // init validation
    var yupObject = generateObjectSchema(workExperienceData)
    var yupSchema = yupObject.reduce(generateYupSchema, {})
    var validationSchema = yup.object().shape(yupSchema)
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        handleInit()
    }, [])

    const handleInit = () => {
        var entity_id = auth['id']

        // fetch experience
        dataServicePrivate('POST', 'entity/experience/all', {
            filter: [{
                operator: '=',
                target: 'entity_id',
                value: entity_id,
            }],
            relations: ['details'],
        }).then((result) => {
            console.log('debug experience result', result);
            result = result.data['experience'][0]

            if (local && (local == JSON.stringify(result))) {
                result = JSON.parse(local)
            } else {
                localStorage.setItem('work_experience', JSON.stringify(result))
            }
            setExperience(result)
            getExperienceDetails(result['id'])

        }).catch((err) => {
            console.log('debug experience error result', err);

        })
    }

    const getExperienceDetails = (id) => {
        dataServicePrivate('POST', 'entity/experience/details/all', {
            filter: [{
                operator: '=',
                target: 'experience_id',
                value: id,
            }],
            order: {
                target: 'start_date',
                value: 'desc'
            }
        }).then((result) => {
            console.log('debug experience details result', result);
            result = result.data['experience_details']
            setDetails(result)

            var total_years = 0
            var total_months = 0
            Object.keys(result).map((item, index) => {
                var start = moment(result[item].start_date)
                var end = result[item].present ? moment() : moment(result[item].end_date)

                var years = end.diff(start, 'year')
                start.add(years, 'years')

                var months = end.diff(start, 'month')
                start.add(months, 'months')

                total_years += years
                total_months += months
            })
            setYears(total_years += Math.round(total_months / 12))
            setMonths(total_months % 12)
            console.log('total', total_years, total_months);

        }).catch((err) => {
            console.log('debug experience details error result', err);

        })
    }

    useEffect(() => {
        if (experience) {
            const onbeforeunloadFn = () => {
                localStorage.setItem('work_experience', JSON.stringify(experience))
            }
          
            window.addEventListener('beforeunload', onbeforeunloadFn);
            return () => {
                window.removeEventListener('beforeunload', onbeforeunloadFn);
            }
        }
    },[experience])

    const handleSubmit = (data) => {
        dataServicePrivate('POST', 'entity/experience/define', {...data, total_experience: `${years} ${years>1?'years':'year'} & ${months} ${months>1?'months':'month'}`}).then((result) => {
            console.log('debug experience define result', result);
            removeLocal()
            navigate('/careers/personalinfo', { replace: true })
        }).catch((err) => {
            console.log('debug experience define error result', err);

        })
    }

    const handleDelete = (id) => {
        dataServicePrivate('POST', 'entity/experience/details/delete', {id}).then((result) => {
            console.log('debug experience details delete result', result);
            removeLocal()
            getExperienceDetails(experience['id'])
        }).catch((err) => {
            console.log('debug experience details delete error result', err);

        })
    }

    const handleDialogClose = () => setDialog(dispatch, {...dialog, open: false})


    const deleteHandle = (id) => {
        setDialog(dispatch, {
          open: true,
          id: id,
          title: (
            <MDBox
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#2E5B6F",
                padding: "12px 20px",
                borderTopLeftRadius: "8px",
                borderTopRightRadius: "8px",
                boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
                position: "relative",
              }}
            >
              <Typography
                variant="h6"
                color="white"
                sx={{
                  fontWeight: "600",
                  fontSize: "1.25rem",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Icon sx={{ color: "#FF9800", fontSize: 30 }}>info</Icon>
                Confirm Delete
              </Typography>
              <IconButton
                onClick={handleDialogClose}
                sx={{
                  position: "absolute",
                  top: "10px",
                  right: "20px",
                  color: "#FFFFFF",
                  "&:hover": {
                    color: "red",
                  },
                }}
              >
                <Icon sx={{ fontSize: 30, color: "white" }}>close</Icon>
              </IconButton>
            </MDBox>
          ),
          content: (
            <MDBox p={2}>
              <Typography variant="body1" color="textSecondary">
                Are you sure you want to delete this item? This action cannot be undone.
              </Typography>
            </MDBox>
          ),
          action: (
            <MDBox p={2} display="flex" justifyContent="flex-end" gap={2}>
              <MDButton
                onClick={handleDialogClose}
                color="secondary"
                variant="outlined"
                sx={{
                  padding: "8px 16px",
                  borderColor: "#F44336",
                  color: "#F44336",
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: "#FFC5C5",
                    borderColor: "#F44336",
                  },
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Icon sx={{ fontSize: 20 }}>cancel</Icon>
                Cancel
              </MDButton>
              <MDButton
                color="primary"
                variant="contained"
                sx={{
                  padding: "8px 16px",
                  backgroundColor: "#4CAF50",
                  "&:hover": {
                    backgroundColor: "#388E3C",
                  },
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
                autoFocus
                onClick={() => {
                  handleDelete(id);
                  handleDialogClose();
                }}
              >
                <Icon sx={{ fontSize: 20 }}>delete</Icon>
                Confirm
              </MDButton>
            </MDBox>
          ),
        });
      };


    return (
        <PageLayout>
            <NavBar position='absolute' />
            <MDBox mt={5} maxWidth="sm" mx='auto' pt={6} pb={3}>
                <Card variant="outlined">
                    <CardContent>
                        <IconButton onClick={prevPage}><Icon>keyboard_backspace</Icon></IconButton>
                        <MDTypography sx={{ mt: 3 }} variant='h3'>Work Experience</MDTypography>
                        <MDTypography sx={{ mt: 3}}  variant='button' color='error'>OJT/Internship can be considered </MDTypography>
                        {/* Show loading state when updating */}
                        {loading && (
                          <MDTypography
                            color="error"
                            variant="h5"
                            sx={{ my: 2, textAlign: "center" }}
                          >
                            Loading...
                          </MDTypography>
                        )}
                        {!loading && details && Object.keys(details).length === 0 && (
                          <MDTypography
                            color="error"
                            variant="h5"
                            sx={{ my: 2, textAlign: "center" }}
                          >
                            No work experience found
                          </MDTypography>
                        )}
                        <Divider />
                        {details && Object.keys(details).map((item, index) => (
                            <Card position='relative' sx={{ my: 2 }}>
                                <MDBox display='flex' position='absolute' right={0} p={1}>
                                    <IconButton onClick={() => toPage('/careers/personalinfo/experienceform', { id: details[item].id })}><Icon color="primary">edit</Icon></IconButton>
                                    <IconButton onClick={() => deleteHandle(details[item].id)}><Icon color="error">delete</Icon></IconButton>
                                </MDBox>
                                <CardContent>
                                    <MDTypography variant='h5'>{details[item].company}</MDTypography>
                                    <MDTypography variant='body2' sx={{ textTransform: 'capitalize' }}>{details[item].position_held}</MDTypography>
                                    <MDTypography variant='body2' sx={{ textTransform: 'capitalize' }}>{details[item].department}</MDTypography>
                                    <MDTypography variant='body2'>
                                        {formatDateTime(details[item].start_date, 'MMMM YYYY')} to {details[item].present ? `Present` : formatDateTime(details[item].end_date, 'MMMM YYYY')}
                                    </MDTypography>
                                    <MDTypography variant='body2' sx={{ textTransform: 'capitalize' }}>{details[item].stay_length}</MDTypography>
                                    <MDTypography variant='body2' sx={{ textTransform: 'capitalize' }}>{details[item].leave_reason}</MDTypography>
                                </CardContent>
                            </Card>
                        ))}
                        <MDBox display='flex' justifyContent='end' my={2}>
                            <MDTypography sx={{ mx: 2 }} variant='button'>Total Work Experience: {years} {years>1?'years':'year'} & {months} {months>1?'months':'month'}</MDTypography>
                        </MDBox>
                        {details && Object.keys(details).length < 3 && (
                          <MDButton
                            variant='outlined'
                            color='secondary'
                            fullWidth
                            startIcon={<Icon sx={{ color: 'inherit' }}>add</Icon>} // Ensuring icon inherits color
                            onClick={() => toPage('/careers/personalinfo/experienceform')}
                            sx={{
                              borderColor: 'secondary.main', // Default border color
                              color: 'secondary.main', // Default text color
                              transition: 'all 0.3s ease', // Smooth transition for all properties
                              '&:hover': {
                                borderColor: 'red', // Change border color on hover
                                color: 'red', // Ensure text and icon turn red on hover
                                '& .MuiTypography-root': {
                                  color: 'inherit', // Ensure Typography inherits color from button
                                },
                                '& .MuiSvgIcon-root': {
                                  color: 'inherit', // Ensure Icon inherits color from button
                                },
                              },
                            }}
                          >
                            <MDTypography variant='body2' color='inherit'>
                              Add Work Experience
                            </MDTypography>
                          </MDButton>
                        )}

                        <Divider />
                        {experience && <Formik
                            initialValues={experience}
                            validationSchema={validationSchema}
                            onSubmit={(data) => {
                                handleSubmit(data)
                            }}
                        >
                            {({values, touched, errors, handleChange, handleBlur, setFieldValue}) => (
                                <Form>
                                    <FieldArray
                                        render={arrayHelper => (
                                        <MDBox>
                                            {setExperience(values)}
                                            {Object.keys(workExperienceData).map((item, index) => {
                                                return (generateFormInput({
                                                    variant: 'outlined',
                                                    fullWidth: true,
                                                    type: workExperienceData[item].type,
                                                    id: workExperienceData[item].id,
                                                    name: workExperienceData[item].id,
                                                    label: workExperienceData[item].label,
                                                    value: values[workExperienceData[item].id],
                                                    required: workExperienceData[item].required,
                                                    onChange: handleChange,
                                                    onBlur: handleBlur,
                                                    setFieldValue,
                                                    error: touched[workExperienceData[item].id] && Boolean(errors[workExperienceData[item].id]),
                                                    helperText: touched[workExperienceData[item].id] && errors[workExperienceData[item].id],
                                                    options: workExperienceData[item].options ? workExperienceData[item].options : undefined
                                                }))
                                            })}
                                        </MDBox>
                                        )}
                                    />
                                    <MDButton sx={{ my: 1 }} color='info' fullWidth type='submit'startIcon={<Icon>save</Icon>} >Save</MDButton>
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

export default WorkExperienceForm;