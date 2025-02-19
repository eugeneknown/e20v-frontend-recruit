import {Card, CardContent, CardHeader, Chip, Container, Divider, Icon, Link} from "@mui/material";
import Grid from "@mui/material/Grid2";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

import PageLayout from "examples/LayoutContainers/PageLayout";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import useAuth from "hooks/useAuth";
import { useEffect, useState } from "react";
import NavBar from "layouts/content_page/nav_bar";
import moment from "moment";

import CareersStepper from "../careers-stepper";
import MDButton from "components/MDButton";
import { useLocation, useNavigate } from "react-router-dom";
import { dataServicePrivate } from "global/function";
import Footer from "examples/Footer";
import { formatDateTime } from "global/function";

import detailsData from "./personal-details/detailsData";


function PersonalInformation(){

    // navigation
    const navigate = useNavigate();
    const location = useLocation(); 
    const from = location.state?.from?.pathname || "/";
    const prevPage = () => navigate(from, { replace: true })
    const toPage = (url, params={}) => navigate(url, { state: { from: location, ...params }, replace: true })
    const [loading, setLoading] = useState(false);

    // save this career id in cache

    const {isAuth, auth} = useAuth();
    console.log('auth', auth);
    const [entity, setEntity] = useState()
    const [experience, setExperience] = useState()
    const [details, setDetails] = useState()
    const [educations, setEducations] = useState()
    const [hasDependents, setHasDependents] = useState(false)
    const [dependents, setDependents] = useState()
    const [disabled, setDisable] = useState(true)
    const [elem, setElem] = useState()
    const [high, setHigh] = useState()
    // remove personal local data
    localStorage.removeItem('entity')
    localStorage.removeItem('entity_details')
    localStorage.removeItem('work_experience')
    localStorage.removeItem('experience')
    localStorage.removeItem('answers')

    useEffect(() => {
        var entity_id = auth['id']

        // fetch entity
        dataServicePrivate('POST', 'entity/entities/all', {
            filter: [{
                operator: '=',
                target: 'id',
                value: entity_id,
            }],
            relations: ['details']
        }).then((result) => {
            console.log('debug entity result', result);
            result = result.data['entity'][0]

            // fetch dependents
            if ( result['children'] == 'Yes' ) setHasDependents(true)

            var title = ['full_name', 'contact_number', 'email', 'permanent_address']
            var color = []
            var variant = ['h6']
            var temp = []
            if ( result?.created_at ) {
                Object.keys(title).map((item, index) => {
                    temp.push({
                        title: result[title[item]],
                        color: color[index] ? color[index] : 'inherit',
                        variant: variant[index] ? variant[index] : 'body2',
                    })
                })
                setEntity(temp)
            }

            var detail = result['details'][0]
            var title = ['salary', 'us_time', 'work_in_office', 'application', 'start']
            var color = []
            var variant = []

            if ( detail?.created_at ) {
                var temp = []
                Object.keys(title).map((item, index) => {
                    temp.push({
                        title: `${detailsData[detailsData.findIndex((e) => e.id == title[item])].label}: ${detail[title[item]]}`,
                        color: color[index] ? color[index] : 'inherit',
                        variant: variant[index] ? variant[index] : 'body2',
                    })
                })
                setDetails(temp)
            }
        }).catch((err) => {
            console.log('debug entity error result', err);

        })

        // fetch experience
        dataServicePrivate('POST', 'entity/experience/all', {
            filter: [{
                operator: '=',
                target: 'entity_id',
                value: entity_id,
            }],
        }).then((result) => {
            console.log('debug experience result', result);
            result = result.data['experience'][0]
            // fetch experience details
            dataServicePrivate('POST', 'entity/experience/details/all', {
                filter: [{
                    operator: '=',
                    target: 'experience_id',
                    value: result['id'],
                }],
                order: {
                    target: 'start_date',
                    value: 'desc'
                }
            }).then((result) => {
                console.log('debug experience details result', result);
                result = result.data['experience_details']
                var title = []
                Object.keys(result).map((item, index) => {
                    title.push(['company', 'position_held', 'start_date', 'stay_length'])
                })
                var color = []
                var variant = ['h6']

                if (result.length) {
                    var temp = []
                    Object.keys(title).map((item, index) => {
                        var _temp = []
                        Object.keys(title[item]).map((_item, _index) => {
                            _temp.push({
                                title: title[item][_item] == 'start_date' ? 
                                <MDTypography variant='body2'>
                                    {formatDateTime(result[item]['start_date'], 'MMMM YYYY')} to {result[item]['end_date'] ?  formatDateTime(result[item]['end_date'], 'MMMM YYYY') : `Present`}
                                </MDTypography> : result[item][title[item][_item]] ,
                                color: color[_index] ? color[_index] : 'inherit',
                                variant: variant[_index] ? variant[_index] : 'body2',
                            })
                        })
    
                        temp.push(_temp)
                    })
                    setExperience(temp)
                }

            }).catch((err) => {
                console.log('debug experience details error result', err);

            })

        }).catch((err) => {
            console.log('debug experience error result', err);

        })

        // entity education
        dataServicePrivate('POST', 'entity/education/all', {
            filter: [{
                operator: '=',
                target: 'entity_id',
                value: entity_id,
            }],
        }).then((result) => {
            console.log('debug entity education result', result);
            result = result.data['entity_education']
            var seq = [
                "Elementary",
                "Secondary (High School)",
                "Senior High School",
                "Vocational & Technical Education",
                "College",
                "Graduate School (Master's or Doctorate)"
            ]
            var check = ['education', 'school', 'course', 'start_date', 'end_date']
            
            if ( Object.keys(result).length ) {
                var color = []
                var variant = ['h6']
                var temp = []
            
                seq.forEach((item) => {
                    var _temp = []
                    var index = Object.keys(result).findIndex((e) => result[e].education == item)

                    if ( index >= 0 ) {

                        check.forEach((_item, _index) => {
                            if ( result[index][_item] ) {
                                _temp.push({
                                    title: 
                                    _item == 'start_date' || _item == 'end_date'
                                    ?   result[index]['start_date'] 
                                        ?   _item == 'start_date' && ( result[index]['start_date'] && result[index]['start_date'] ) &&
                                            <MDTypography variant='body2'>
                                                {formatDateTime(result[index].start_date, 'YYYY')} {
                                                    result[index]['present'] 
                                                    ? `to Present` 
                                                    : result[index]['undergrad']
                                                    ? `Undergraduate`
                                                    : `to ${formatDateTime(result[index].end_date, 'YYYY')}`
                                                }
                                            </MDTypography>
                                        : <MDTypography variant='body2'>
                                            {formatDateTime(result[index]['end_date'], 'YYYY')}
                                        </MDTypography> 
                                    : result[index][_item],
                                    color: color[_index] ? color[_index] : 'inherit',
                                    variant: variant[_index] ? variant[_index] : 'body2',
                                })
                            }
                        })
                        temp.push(_temp)
                    }
                })
            
                setEducations(temp)
            }
            

        }).catch((err) => {
            console.log('debug entity education error result', err);

        })

        // entity dependents
        dataServicePrivate('POST', 'entity/dependents/all', {
            filter: [{
                operator: '=',
                target: 'entity_id',
                value: entity_id,
            }],
        }).then((result) => {
            result = result.data['entity_dependents']
            var title = []
            Object.keys(result).map((item, index) => {
                title.push(['name', 'birthday', 'relationship'])
            })
            var color = []
            var variant = ['h6']

            if (result.length) {
                var temp = []
                Object.keys(title).map((item, index) => {
                    var _temp = []
                    Object.keys(title[item]).map((_item, _index) => {
                        _temp.push({
                            title: title[item][_item] == 'birthday' ? 
                            <MDTypography variant='body2'>
                                {formatDateTime(result[item]['birthday'], 'MMMM DD, YYYY')}
                            </MDTypography> : result[item][title[item][_item]] ,
                            color: color[_index] ? color[_index] : 'inherit',
                            variant: variant[_index] ? variant[_index] : 'body2',
                        })
                    })

                    temp.push(_temp)
                })
                setDependents(temp)
            }

        }).catch((err) => {
            console.log('debug entity error result', err);

        })
    }, [])

    useEffect(() => {
        console.log('personal entity', entity);
        console.log('personal details', details);
        console.log('personal educations', educations);
        console.log('personal experience', experience);
        console.log('personal dependents', dependents);
    
        const isEducationComplete = () => {
            if (!educations || !educations.length) return false;
    
            const requiredLevels = ["Elementary", "Secondary (High School)"];
    
            const hasRequiredLevels = requiredLevels.every((level) =>
                educations.some((edu) =>
                    edu.some((field) => field.title === level)
                )
            );
    
           
    
            return hasRequiredLevels;
        };
    
        const allFieldsFilled = entity && details && (hasDependents ? dependents : true);
        const isEducationValid = isEducationComplete();
    
        setDisable(!(allFieldsFilled && isEducationValid));
    }, [entity, details, educations, experience, dependents]);
    

    const InformationContent = ({title, data, url}) => (
        <Card sx={{ mx: 5, my: 3 }}>
            <CardContent>
                <MDTypography variant='h6' color='info'>{title}</MDTypography>
                <Divider />
                {
                    data ? Object.keys(data).map((item, index) => (
                        <MDTypography 
                        key={index} 
                        color={data[item]?.color ? data[item].color : 'inherit'}
                        variant={data[item]?.variant ? data[item].variant : ''}
                        sx={{ textTransform: 'math-auto' }}
                        >{data[item].title}{Object.keys(data).length == index+1 && '...'}</MDTypography>
                    )) 
                    : <MDBox display='flex' justifyContent='center'><MDTypography color='secondary' variant='button' >Add your information here</MDTypography></MDBox>
                }
               <MDButton   
                onClick={() => toPage(url)} 
                sx={{ 
                    mt: 2, 
                    borderColor: 'secondary.main', // Default border color
                    color: 'secondary.main', // Default text color
                    transition: 'all 0.3s ease', // Smooth transition for hover effect
                    '& .MuiSvgIcon-root': { color: 'inherit' }, // Ensure the icon inherits the text color
                    '&:hover': {
                    borderColor: 'red', // Border turns red
                    color: 'red', // Text turns red
                    '& .MuiSvgIcon-root': { color: 'red' }, // Icon turns red
                    }
                }} 
                variant='outlined' 
                fullWidth 
                color='secondary' 
                startIcon={<Icon>{data ? `edit` : `add`}</Icon>}
                >
                {`${data ? 'Edit' : 'Add'} ${title}`}
                </MDButton>
            </CardContent>
        </Card>
    )

    const WorkExpContent = ({title, data, url}) => (
        <Card sx={{ mx: 5, my: 3 }}>
            <CardContent>
                <MDTypography variant='h6' color='info'>{title}</MDTypography>
                <Divider />
                {
                    data ? Object.keys(data).map((item, index) => {
                        return (
                            <MDBox>
                                {Object.keys(data[item]).map((_item, _index) => (
                                    <MDTypography 
                                    key={index} 
                                    color={data[item][_item]?.color ? data[item][_item].color : 'inherit'}
                                    variant={data[item][_item]?.variant ? data[item][_item].variant : ''}
                                    sx={{ textTransform: 'math-auto' }}
                                    >{data[item][_item].title}</MDTypography>
                                ))}
                                <Divider />
                            </MDBox>
                        )
                    })
                    : <MDBox display='flex' justifyContent='center'><MDTypography color='secondary' variant='button' >Add your information here</MDTypography></MDBox>
                }
              <MDButton   
                onClick={() => toPage(url)} 
                sx={{ 
                    mt: 2, 
                    borderColor: 'secondary.main', // Default border color
                    color: 'secondary.main', // Default text color
                    transition: 'all 0.3s ease', // Smooth transition effect
                    '& .MuiSvgIcon-root': { color: 'inherit' }, // Ensure the icon inherits the text color
                    '&:hover': {
                    borderColor: 'red', // Border turns red
                    color: 'red', // Text turns red
                    '& .MuiSvgIcon-root': { color: 'red' }, // Icon turns red
                    }
                }} 
                variant='outlined' 
                fullWidth 
                color='secondary' 
                startIcon={<Icon>{data ? `edit` : `add`}</Icon>}
                >
                {`${data ? 'Edit' : 'Add'} ${title}`}
                </MDButton>
            </CardContent>
        </Card>
    )
    const [missingInfo, setMissingInfo] = useState([]);

    useEffect(() => {
    const checkMissingInfo = () => {
        let missing = [];

        // Personal Information
        missing.push({
            key: "personal-info",
            label: "Personal Information",
            missing: !entity || entity.length === 0
        });

        // Dependents (Optional)
        if (hasDependents) {
            missing.push({
                key: "missing-dependents",
                label: "Dependents",
                missing: !dependents || dependents.length === 0
            });
        }

        // Educational Background Check
        const educationData = educations || [];

        const hasElementary = educationData.some(edu => edu.some(field => field.title === "Elementary"));
        const hasHighSchool = educationData.some(edu => edu.some(field => field.title === "Secondary (High School)"));
      
        let missingEdu = [];

        if (!hasElementary) missingEdu.push("• Elementary is required");
        if (!hasHighSchool) missingEdu.push("• High School is required");
    
        missing.push({
            key: "missing-educational-background",
            label: (
                <>
                    Educational Background
                    {missingEdu.length > 0 && (
                        <div style={{ marginLeft: "15px", whiteSpace: "pre-line" }}>
                            {missingEdu.map((text, index) => (
                                <div key={index}>{text}</div>
                            ))}
                        </div>
                    )}
                </>
            ),
            missing: missingEdu.length > 0
        });

        // Work Experience
        missing.push({
            key: "missing-work-experience",
            label: "Work Experience",
            missing: !experience || experience.length === 0
        });

        // Other Details
        missing.push({
            key: "missing-other-details",
            label: "Other Details",
            missing: !details || details.length === 0
        });

        setMissingInfo(missing);
    };
 
    checkMissingInfo();
    }, [entity, dependents, experience, details, educations]);
    
    return (
        <PageLayout>
            <NavBar position='absolute' />
            <Grid container pt={6} pb={3}>
                <Grid size={{ xs: 12, lg: 7 }}>
                    <MDBox maxWidth="sm" mx={{ xs: 3, md: 'auto', lg: 3, xl: 'auto' }} pt="5rem">
                        <Card variant="outlined">
                            <CardHeader 
                                title={<MDTypography variant='h3'>INFORMATION</MDTypography>} 
                                subheader='Add personal information'
                                avatar={<Icon fontSize="large">person_outline</Icon>} 
                            />
                            <CardContent>
                                <InformationContent title='PERSONAL INFORMATION' data={entity} url='/careers/personalinfo/personalform' />
                                { hasDependents && <WorkExpContent title='DEPENDENTS' data={dependents} url='/careers/personalinfo/dependents' /> }
                                <WorkExpContent title='EDUCATIONAL BACKGROUND' data={educations} url='/careers/personalinfo/educational' />
                                <WorkExpContent title='WORK EXPERIENCE' data={experience} url={'/careers/personalinfo/workexperienceform'} />
                                <InformationContent title='OTHER DETAILS' data={details} url='/careers/personalinfo/detailsform' />
                                <MDButton onClick={() => toPage('/careers/questions')} disabled={disabled || loading} startIcon={<Icon>check</Icon>} fullWidth color={disabled ? 'secondary' : 'info'} sx={{ px: 5 }}> {loading ? 'Loading...' : 'Continue'} </MDButton>
                            </CardContent>
                        </Card>
                    </MDBox>
                </Grid>
                <Grid display={{ xs: 'none', lg: 'block' }} item lg={5}>
                    <MDBox 
                        display="flex" 
                        flexDirection="column" 
                        position="fixed" 
                        sx={{ top: "5%", width: "30%", gap: 1 }}
                    >  
                        <CareersStepper activeStep={0} orientation='vertical' />  
    
                    <Card variant="outlined" sx={{ p: 1, mt: -10, width: "79%",maxWidth: "75vw", mx: "auto" }}>
                            <CardHeader 
                                title={<MDTypography variant='h5'>Complete Your Information</MDTypography>} 
                                subheader="Please provide the necessary details to proceed."
                                avatar={<Icon fontSize="large" color="info">info</Icon>}
                            />
                            <CardContent sx={{ pt: 1, mt: -1.5 }}>
                                {missingInfo.map((item, index) => (
                                    <MDBox key={index} display="flex" alignItems="flex-start" sx={{ mb: 1 }}>
                                        {item.missing ? (
                                            <CancelIcon color="error" sx={{ mr: 1 }} />  
                                        ) : (
                                            <CheckCircleIcon color="success" sx={{ mr: 1 }} /> 
                                        )}
                                        <MDTypography variant="body2" color={item.missing ? "error" : "success"} sx={{whiteSpace: "pre-line", ml: 1}}>
                                            {item.label}
                                        </MDTypography>
                                    </MDBox>
                                ))}
                            </CardContent>
                        </Card>
                    </MDBox>
                </Grid>
            </Grid>
        </PageLayout>
    );    
}

export default PersonalInformation;