import {Accordion, AccordionDetails, AccordionSummary, AppBar, Card, CardContent, Chip, Container, Divider, Icon, Link, Tab, Tabs} from "@mui/material";
import Grid from "@mui/material/Grid";

import PageLayout from "examples/LayoutContainers/PageLayout";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import useAuth from "hooks/useAuth";
import { useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { dataServicePrivate, formatDateTime } from "global/function";
import NavBar from "layouts/content_page/nav_bar";
import moment from "moment";
import ImageView from "layouts/dashboard/employee/image-viewer";
// import AudioPlayer from "material-ui-audio-player";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import MDButton from "components/MDButton";
import SwipeableViews from "react-swipeable-views";

import entityData from "../personal-information/personal/entityData";
import detailsData from "../personal-information/personal-details/detailsData";
import dependentsData from "../personal-information/dependents/dependentsData";
import Footer from "examples/Footer";
import educationData from "./educationData";
import experienceData from "../personal-information/work-experience/experienceData";
import referenceData from "../reference-information/referenceData";


function Response(){

    const {isAuth, auth} = useAuth();
    const { id } = auth
    const [params, setParams] = useSearchParams('');
    const [entity, setEntity] = useState()
    const [dependents, setDependents] = useState()
    const [education, setEducation] = useState()
    const [experience, setExperience] = useState()
    const [details, setDetails] = useState()
    const [answers, setAnswers] = useState()
    const [reference, setReference] = useState()
    const [step, setStep] = useState(0)
    const actionRef = useRef()

    const careerId = localStorage.getItem('career_id')

    useEffect(() => {
        var entity_id = params.get('entity')
        var careers_id = params.get('careers')
        console.log('debug response params', entity_id, careers_id);

        // fetch entity
        dataServicePrivate('POST', 'entity/entities/all', {
            filter: [{
                operator: '=',
                target: 'id',
                value: id,
            }],
            relations: ['details', 'educations', 'reference', 'dependents']
        }).then((result) => {
            console.log('debug entity result', result);
            result = result.data['entity'][0]
            setEntity(result)
            if (result['dependents'].length) setDependents(result['dependents'])
            setEducation(result['educations'])
            setReference(result['reference'])
            setDetails(result['details'])

        }).catch((err) => {
            console.log('debug entity error result', err);

        })

        // fetch experience
        dataServicePrivate('POST', 'entity/experience/all', {
            filter: [{
                operator: '=',
                target: 'entity_id',
                value: id,
            }],
            relations: [
                {
                    details: {
                        order: {
                            target: 'start_date',
                            value: 'desc'
                        }
                    }
                },
            ],
        }).then((result) => {
            console.log('debug entity experience result', result);
            result = result.data['experience']
            setExperience(result[0])

        }).catch((err) => {
            console.log('debug entity experience error result', err);

        })

        // fetch answers
        dataServicePrivate('POST', 'hr/careers/answers/all', {
            filter: [
                {
                    operator: '=',
                    target: 'entity_id',
                    value: entity_id,
                },
                {
                    operator: '=',
                    target: 'careers_id',
                    value: careers_id,
                },
            ],
            relations: ['question'],
        }).then((result) => {
            console.log('debug answers result', result);
            setAnswers(result.data['career_answers'])

        }).catch((err) => {
            console.log('debug answers error result', err);

        })

    }, [])

    var orderlist = ['full_name', 'first_name', 'middle_name', 'last_name', 'email', 'contact_number']
    var blacklist = ['id', 'created_at', 'deleted_at', 'email_verified', 'email_verified_at', 'image', 'status', 'updated_at', 'users_id']

    const nextStep = () => {
        setStep(step+1)
    }

    const accordHeightChange = () => {
        setTimeout(() => {
            if (actionRef) actionRef.current.updateHeight()
        }, 500);
    }

    var tabs = ['Information', 'Questions', 'Reference']

    const renderInfo = (title, value) => (
        <MDBox display="flex" py={1} pr={2}>
            <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
                {title}: &nbsp;
            </MDTypography>
            <MDTypography variant="button" fontWeight="regular" color="text">
                &nbsp;{moment(value).isValid() && typeof value != 'number' && value != '0' ? formatDateTime(value, 'MM-DD-YYYY') : value}
            </MDTypography>
        </MDBox>
    )

    return (
        <PageLayout>
            <NavBar position='absolute' />
            <MDBox mt={5} maxWidth="sm" mx='auto' pt={6} pb={3}>
                <AppBar position="static">
                    <Tabs value={step} onChange={(e, val) => {setStep(val); accordHeightChange();}}>
                        {tabs.map(item => (<Tab label={item} />))}
                    </Tabs>
                </AppBar>
                <SwipeableViews
                    index={step}
                    animateHeight
                    ref={actionRef}
                >
                    <MDBox>
                        <Card variant="outlined" sx={{ my: 2 }}>
                            <CardContent sx={{ p: '0.5rem 1.5rem!important' }}>
                                <Accordion
                                    sx={{ boxShadow: 0 }}
                                    defaultExpanded
                                    slotProps={{ transition: { addEndListener: accordHeightChange } }}
                                >
                                    <AccordionSummary expandIcon={<Icon fontSize="5px">expand_more</Icon>}><MDTypography variant='h5' textTransform='uppercase'>Personal Information</MDTypography></AccordionSummary>
                                    <AccordionDetails>
                                        {entity && Object.keys(entityData).map((item, index) => renderInfo(entityData[item].label, entity[entityData[item].id]))}
                                    </AccordionDetails>
                                </Accordion>
                            </CardContent>
                        </Card>
                        {dependents &&
                        <Card variant="outlined" sx={{ my: 2 }}>
                            <CardContent sx={{ p: '0.5rem 1.5rem!important' }}>
                                <Accordion
                                    sx={{ boxShadow: 0 }}
                                    defaultExpanded
                                    slotProps={{ transition: { addEndListener: accordHeightChange } }}
                                >
                                    <AccordionSummary expandIcon={<Icon fontSize="5px">expand_more</Icon>}><MDTypography variant='h5' textTransform='uppercase'>Dependents</MDTypography></AccordionSummary>
                                    <AccordionDetails>
                                        {dependents && Object.keys(dependents).map((item, index) => (
                                            <Card variant="outlined" sx={{ my: 2 }}>
                                                <CardContent>
                                                    {Object.keys(dependentsData).map((_item, _index) => renderInfo(dependentsData[_item].label, dependents[item][dependentsData[_item].id]))}
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </AccordionDetails>
                                </Accordion>
                            </CardContent>
                        </Card>}
                        {education &&
                        <Card variant="outlined" sx={{ my: 2 }}>
                            <CardContent sx={{ p: '0.5rem 1.5rem!important' }}>
                                <Accordion
                                    sx={{ boxShadow: 0 }}
                                    defaultExpanded
                                    slotProps={{ transition: { addEndListener: accordHeightChange } }}
                                >
                                    <AccordionSummary expandIcon={<Icon fontSize="5px">expand_more</Icon>}><MDTypography variant='h5' textTransform='uppercase'>Education</MDTypography></AccordionSummary>
                                    <AccordionDetails>
                                        {education && Object.keys(education).map((item, index) => (
                                            <Card variant="outlined" sx={{ my: 2 }}>
                                                <CardContent>
                                                    {Object.keys(educationData).map((_item, _index) => {
                                                        if (education[item][educationData[_item].id]) {
                                                            if ( educationData[_item].label == 'education' ) {
                                                                return (
                                                                    <MDBox display="flex" py={1} pr={2} justifyContent='center'>
                                                                        <MDTypography variant="button" fontWeight="bold" textTransform="uppercase">
                                                                            &nbsp;{moment(value).isValid() && typeof value != 'number' && value != '0' ? formatDateTime(value, 'MM-DD-YYYY') : value}
                                                                        </MDTypography>
                                                                    </MDBox>
                                                                )
                                                            } else {
                                                                return renderInfo(educationData[_item].label, education[item][educationData[_item].id])
                                                            }
                                                        }
                                                    })}
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </AccordionDetails>
                                </Accordion>
                            </CardContent>
                        </Card>}
                        {experience &&
                        <Card variant="outlined" sx={{ my: 2 }}>
                            <CardContent sx={{ p: '0.5rem 1.5rem!important' }}>
                                <Accordion
                                    sx={{ boxShadow: 0 }}
                                    defaultExpanded
                                    slotProps={{ transition: { addEndListener: accordHeightChange } }}
                                >
                                    <AccordionSummary expandIcon={<Icon fontSize="5px">expand_more</Icon>}><MDTypography variant='h5' textTransform='uppercase'>Work Experience</MDTypography></AccordionSummary>
                                    <AccordionDetails>
                                        {renderInfo('Total Work Experience', experience['total_experience'])}
                                        {experience && Object.keys(experience.details).map((item, index) => (
                                            <Card variant="outlined" sx={{ my: 2 }}>
                                                <CardContent>
                                                    {Object.keys(experienceData).map((_item, _index) => experience['details'][item][experienceData[_item].id] && renderInfo(experienceData[_item].label, experience['details'][item][experienceData[_item].id]))}
                                                </CardContent>
                                            </Card>
                                        ))}
                                        {renderInfo('Other Experience', experience['other_experience'])}
                                    </AccordionDetails>
                                </Accordion>
                            </CardContent>
                        </Card>}
                        <Card variant="outlined" sx={{ my: 2 }}>
                            <CardContent sx={{ p: '0.5rem 1.5rem!important' }}>
                                <Accordion
                                    sx={{ boxShadow: 0 }}
                                    defaultExpanded
                                    slotProps={{ transition: { addEndListener: accordHeightChange } }}
                                >
                                    <AccordionSummary expandIcon={<Icon fontSize="5px">expand_more</Icon>}><MDTypography variant='h5' textTransform='uppercase'>Other Details</MDTypography></AccordionSummary>
                                    <AccordionDetails>
                                        {details && Object.keys(detailsData).map((item, index) => renderInfo(detailsData[item].label, details[0][detailsData[item].id]))}
                                    </AccordionDetails>
                                </Accordion>
                            </CardContent>
                        </Card>
                        {accordHeightChange()}
                        <Divider sx={{ mt: 3 }} />
                    </MDBox>
                    <MDBox>
                        {answers && Object.keys(answers).map((item, key) => {
                            if (answers[item]['question_data']['type'] == 'input') {
                                return (
                                    <Card variant="outlined" sx={{ my: 2 }} key={key}>
                                        <CardContent sx={{ p: '0.5rem 1.5rem!important' }}>
                                            <MDTypography variant='subtitle2'>{answers[item]['question_data']['title']}</MDTypography>
                                            <Divider />
                                            <MDTypography textTransform="capitalize" variant="caption">{answers[item]['value']}</MDTypography>
                                        </CardContent>
                                    </Card>
                                )
                            } else {
                                return (
                                    <Card variant="outlined" sx={{ my: 2 }} key={key}>
                                        <CardContent sx={{ p: '0.5rem 1.5rem!important' }}>
                                            <MDTypography variant='subtitle2'>{answers[item]['question_data']['title']}</MDTypography>
                                            <Divider />
                                            {
                                                answers[item]['files'] != null ? 
                                                    (
                                                        <MDBox
                                                        display="flex"
                                                        justifyContent='center'>
                                                            {
                                                                String(answers[item]['files']['file_type']).split('/')[1] == 'pdf' &&
                                                                <Link href={answers[item]['files_url']} target="_blank">
                                                                    Open File
                                                                </Link>
                                                            }
                                                            {
                                                                String(answers[item]['files']['file_type']).split('/')[0] == 'image' &&
                                                                <ImageView data={answers[item]} />
                                                            }
                                                            {
                                                                String(answers[item]['files']['file_type']).split('/')[0] == 'audio' &&
                                                                <MDBox width='100%'>
                                                                    <AudioPlayer 
                                                                        src={[answers[item]['files_url']]} 
                                                                    />
                                                                    <Link href={answers[item]['files_url']} target="_blank">
                                                                        <MDButton sx={{ width: '100%', borderRadius: 0, marginTop: '15px', }}>Download</MDButton>
                                                                    </Link>
                                                                </MDBox>
                                                            }
                                                        </MDBox>
                                                    ) 
                                                :
                                                    answers[item]['question_data']['value'].split(', ').map((_key) => {
                                                        if (answers[item]['value'].split(', ').includes(_key)) {
                                                            return (<Chip key={_key} label={_key} sx={{ m: "5px" }} />)
                                                        } 
                                                    }) 
                                            }
                                        </CardContent>
                                    </Card>
                                )
                            }
                        })}
                        <Divider sx={{ mt: 3 }} />
                    </MDBox>
                    <MDBox>
                        {reference &&
                        <Card variant="outlined" sx={{ my: 2 }}>
                            <CardContent sx={{ p: '0.5rem 1.5rem!important' }}>
                                <Accordion
                                    sx={{ boxShadow: 0 }}
                                    defaultExpanded
                                    slotProps={{ transition: { addEndListener: accordHeightChange } }}
                                >
                                    <AccordionSummary expandIcon={<Icon fontSize="5px">expand_more</Icon>}><MDTypography variant='h5'>Character Reference</MDTypography></AccordionSummary>
                                    <AccordionDetails>
                                        {reference && Object.keys(reference).map((item, index) => (
                                            <Card variant="outlined" sx={{ my: 2 }}>
                                                <CardContent>
                                                    {Object.keys(referenceData).map((_item, _index) => reference[item][referenceData[_item].id] && renderInfo(referenceData[_item].label, reference[item][referenceData[_item].id]))}
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </AccordionDetails>
                                </Accordion>
                            </CardContent>
                        </Card>}
                        <Divider sx={{ mt: 3 }} />
                    </MDBox>
                </SwipeableViews>
                <MDBox my={2} display='flex' justifyContent={step==0 ? 'end' : step==2 ? 'start' : 'space-between'}>
                    {step!=0 && <MDButton onClick={()=>setStep(step-1)}>prev</MDButton>}
                    {step!=2 && <MDButton onClick={nextStep}>Next</MDButton>}
                </MDBox>
            </MDBox>
            <Footer />
        </PageLayout>
    );
}

export default Response;