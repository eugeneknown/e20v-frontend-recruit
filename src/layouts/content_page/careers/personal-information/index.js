import {Card, CardContent, CardHeader, Chip, Container, Divider, Icon, Link} from "@mui/material";
import Grid from "@mui/material/Grid2";

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

    // save this career id in cache

    const {isAuth, auth} = useAuth();
    const [entity, setEntity] = useState()
    const [experience, setExperience] = useState()
    const [details, setDetails] = useState()

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
            var title = ['full_name', 'contact_number', 'email', 'permanent_address', 'education', 'course']
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
            var variant = ['h6']

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
                    title.push(['position_held', 'company', 'start_date', 'stay_length'])
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
    }, [])

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
                        sx={{ textTransform: 'capitalize' }}
                        >{data[item].title}{Object.keys(data).length == index+1 && '...'}</MDTypography>
                    )) 
                    : <MDBox display='flex' justifyContent='center'><MDTypography color='secondary' variant='button' >Add your {title} here</MDTypography></MDBox>
                }
                <MDButton   
                onClick={() => toPage(url)} 
                sx={{ mt: 2 }} 
                variant='outlined' 
                fullWidth 
                color='secondary' 
                startIcon={<Icon>{data ? `edit` : `add`}</Icon>}
                >
                    {`${data ? 'Edit' : 'Create'} ${title}`}
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
                                    sx={{ textTransform: 'capitalize' }}
                                    >{data[item][_item].title}</MDTypography>
                                ))}
                                <Divider />
                            </MDBox>
                        )
                    })
                    : <MDBox display='flex' justifyContent='center'><MDTypography color='secondary' variant='button' >Add your {title} here</MDTypography></MDBox>
                }
                <MDButton   
                onClick={() => toPage(url)} 
                sx={{ mt: 2 }} 
                variant='outlined' 
                fullWidth 
                color='secondary' 
                startIcon={<Icon>{data ? `edit` : `add`}</Icon>}
                >
                    {`${data ? 'Edit' : 'Create'} ${title}`}
                </MDButton>
            </CardContent>
        </Card>
    )

    return (
        <PageLayout>
            <NavBar position='absolute' />
            <Grid container pt={6} pb={3}>
                <Grid size={{ xs: 12, lg: 7 }}>
                    <MDBox maxWidth="sm" mx={{ xs: 3, md: 'auto', lg: 3, xl: 'auto' }} pt="5rem">
                        <Card variant="outlined">
                            <CardHeader 
                                title={<MDTypography variant='h3'>Informations</MDTypography>} 
                                subheader='Add a personal information'
                                avatar={<Icon fontSize="large">person_outline</Icon>} 
                            />
                            <CardContent>
                                <InformationContent title='Personal Information' data={entity} url='/careers/personalinfo/personalform' />
                                <WorkExpContent title='Work Experience' data={experience} url='/careers/personalinfo/workexperienceform' />
                                <InformationContent title='Other Details' data={details} url='/careers/personalinfo/detailsform' />
                                <MDButton onClick={() => toPage('/careers/questions')} disabled={!(entity) && !(experience) && !(details)} fullWidth color={!entity && !experience && !details ? 'secondary' : 'info'} sx={{ px: 5 }}>Continue</MDButton>
                            </CardContent>
                        </Card>
                    </MDBox>
                </Grid>
                <Grid display={{ xs: 'none', lg: 'block' }} size={{ lg: 5 }}>
                    <CareersStepper activeStep={0} orientation='vertical' position='fixed' />
                </Grid>
            </Grid>
            <Footer />
        </PageLayout>
    );
}

export default PersonalInformation;