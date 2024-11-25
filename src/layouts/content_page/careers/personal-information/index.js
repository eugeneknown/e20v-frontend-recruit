import {Card, CardContent, Chip, Container, Divider, Icon, Link} from "@mui/material";
import Grid from "@mui/material/Grid2";

import PageLayout from "examples/LayoutContainers/PageLayout";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import useAuth from "hooks/useAuth";
import { useEffect, useState } from "react";
import { dataServicePrivate, formatDateTime } from "global/function";
import NavBar from "layouts/content_page/nav_bar";
import moment from "moment";

import CareersStepper from "../careers-stepper";
import MDButton from "components/MDButton";
import { useLocation, useNavigate } from "react-router-dom";


function PersonalInformation(){

    // navigation
    const navigate = useNavigate();
    const location = useLocation(); 
    const from = location.state?.from?.pathname || "/";

    const {isAuth, auth} = useAuth();
    const [entity, setEntity] = useState({})
    const [experience, setExperience] = useState()
    const [details, setDetails] = useState()

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
        dataServicePrivate('POST', 'entity/experience/all', {
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

    const urlRedirection = (url) => {
        navigate(url)
    }
    
    const InformationContent = ({title, data, url}) => (
        <Card sx={{ m: 5 }}>
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
                onClick={() => urlRedirection(url)} 
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
            <Grid container pt="5rem">
                <Grid size={{ xs: 12, lg: 7 }}>
                    <MDBox maxWidth="sm" mx={{ xs: 3, md: 'auto', lg: 3, xl: 'auto' }} pt="5rem">
                        <Card variant="outlined">
                            <CardContent>
                                <MDTypography variant='h4'>Informations</MDTypography>
                                <InformationContent title='Personal Information' data={entity} url='/personalinfo/personalform' />
                            </CardContent>
                        </Card>
                    </MDBox>
                </Grid>
                <Grid display={{ xs: 'none', lg: 'block' }} size={{ lg: 5 }}>
                    <CareersStepper activeStep={0} />
                </Grid>
            </Grid>
        </PageLayout>
    );
}

export default PersonalInformation;