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
import { dataService } from "global/function";
import Footer from "examples/Footer";


function PersonalInformation(){

    // navigation
    const navigate = useNavigate();
    const location = useLocation(); 
    const from = location.state?.from?.pathname || "/";
    const prevPage = () => navigate(from, { replace: true })
    const toPage = (url) => navigate(url, { state: { from: location }, replace: true })

    const {isAuth, auth} = useAuth();
    const [entity, setEntity] = useState({})
    const [experience, setExperience] = useState()
    const [details, setDetails] = useState()

    useEffect(() => {
        var entity_id = auth['id']

        // fetch entity
        dataService('POST', 'entity/entities/all', {
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
            Object.keys(title).map((item, index) => {
                temp.push({
                    title: result[title[item]],
                    color: color[index] ? color[index] : 'inherit',
                    variant: variant[index] ? variant[index] : 'body2',
                })
            })

            console.log('debug entity data', temp);
            setEntity(temp)

        }).catch((err) => {
            console.log('debug entity error result', err);

        })

        // fetch experience
        dataService('POST', 'entity/experience/all', {
            filter: [{
                operator: '=',
                target: 'entity_id',
                value: entity_id,
            }],
            relations: ['details']           
        }).then((result) => {
            console.log('debug experience result', result);

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
                    Object.keys(data).map((item, index) => (
                        <MDTypography 
                        key={index} 
                        color={data[item]?.color ? data[item].color : 'inherit'}
                        variant={data[item]?.variant ? data[item].variant : ''}
                        sx={{ textTransform: 'capitalize' }}
                        >{data[item].title}{Object.keys(data).length == index+1 && '...'}</MDTypography>
                    ))
                }
                <MDButton 
                onClick={() => toPage(url)} 
                sx={{ mt: 2 }} 
                variant='outlined' 
                fullWidth 
                color='secondary' 
                startIcon={<Icon>edit</Icon>}
                >
                    Edit {title}
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
                            </CardContent>
                        </Card>
                    </MDBox>
                </Grid>
                <Grid display={{ xs: 'none', lg: 'block' }} size={{ lg: 5 }}>
                    <CareersStepper activeStep={0} />
                </Grid>
            </Grid>
            <Footer />
        </PageLayout>
    );
}

export default PersonalInformation;